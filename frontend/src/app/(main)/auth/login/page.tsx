'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, BookOpen, ArrowRight, GraduationCap, Briefcase, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/auth';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'instructor' | 'admin'>('student');
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const redirect = searchParams.get('redirect') || '/';

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, loginType);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (loginType === 'admin') {
        router.push('/admin');
      } else if (loginType === 'instructor') {
        router.push('/instructor');
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  const loginTypes = [
    { type: 'student', icon: GraduationCap, label: 'Student', description: 'Learn and grow' },
    { type: 'instructor', icon: Briefcase, label: 'Instructor', description: 'Teach & earn' },
    { type: 'admin', icon: Shield, label: 'Admin', description: 'Manage platform' },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              EduPlatform
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600 mb-8">Sign in to continue your learning journey</p>

          {/* Login Type Selector */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {loginTypes.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setLoginType(item.type as 'student' | 'instructor' | 'admin')}
                className={`p-3 rounded-xl border-2 transition-all ${
                  loginType === item.type
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <item.icon
                  className={`w-6 h-6 mx-auto mb-1 ${
                    loginType === item.type ? 'text-primary-600' : 'text-gray-400'
                  }`}
                />
                <div
                  className={`text-xs font-medium ${
                    loginType === item.type ? 'text-primary-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </div>
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <div className="flex justify-end mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          {loginType === 'student' && (
            <p className="mt-8 text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary-600 font-semibold hover:text-primary-700">
                Sign up for free
              </Link>
            </p>
          )}

          {loginType === 'instructor' && (
            <p className="mt-8 text-center text-gray-500 text-sm">
              Instructor accounts are created by admins only.
              <br />
              <Link href="/contact" className="text-primary-600 hover:text-primary-700">
                Contact us to become an instructor
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-secondary-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-6">
            Learn from the best instructors worldwide
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-white/90">
                Access 5,000+ courses taught by industry experts
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-white/90">
                Learn at your own pace with lifetime access
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-white/90">
                Get certified and advance your career
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
