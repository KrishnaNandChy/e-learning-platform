'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeft, UserPlus, Mail, User, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { authAPI } from '@/lib/api';

interface InstructorFormData {
  name: string;
  email: string;
  phone?: string;
  headline?: string;
  biography?: string;
  expertise?: string;
}

export default function CreateInstructorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstructorFormData>();

  const onSubmit = async (data: InstructorFormData) => {
    setLoading(true);
    try {
      const response = await authAPI.createInstructor({
        ...data,
        expertise: data.expertise ? data.expertise.split(',').map((e) => e.trim()) : [],
      });

      setGeneratedPassword(response.data.data?.tempPassword || '');
      toast.success('Instructor account created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create instructor');
    } finally {
      setLoading(false);
    }
  };

  if (generatedPassword) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Instructor Account Created!
            </h2>
            <p className="text-gray-600 mb-6">
              The instructor account has been created successfully. Please share the login credentials with the instructor.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Login Credentials</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Temporary Password:</span>
                  <p className="font-mono text-lg font-bold text-primary-600 bg-primary-50 px-3 py-2 rounded mt-1">
                    {generatedPassword}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  The instructor will be prompted to change this password on first login.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/admin/instructors')}>
                View All Instructors
              </Button>
              <Button onClick={() => setGeneratedPassword('')}>
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Instructor Account</h1>
        <p className="text-gray-600 mt-1">
          Create a new instructor account. A temporary password will be generated.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Full Name"
              placeholder="Enter instructor's name"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="instructor@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              helperText="Login credentials will be sent to this email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              leftIcon={<Phone className="w-5 h-5" />}
              {...register('phone')}
            />

            <Input
              label="Professional Headline"
              placeholder="e.g., Senior Software Engineer at Google"
              error={errors.headline?.message}
              {...register('headline')}
            />

            <div>
              <label className="label">Biography</label>
              <textarea
                rows={4}
                placeholder="Brief bio about the instructor..."
                className="input"
                {...register('biography')}
              />
            </div>

            <Input
              label="Areas of Expertise"
              placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
              helperText="Enter expertise areas separated by commas"
              {...register('expertise')}
            />

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" isLoading={loading} leftIcon={<UserPlus className="w-4 h-4" />}>
                Create Instructor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
