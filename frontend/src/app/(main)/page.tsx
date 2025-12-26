'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Play, Users, BookOpen, Award, Star, 
  CheckCircle, Sparkles, TrendingUp, Clock
} from 'lucide-react';
import { Button, Badge, Rating } from '@/components/ui';
import CourseCard from '@/components/course/CourseCard';
import { courseAPI, categoryAPI } from '@/lib/api';
import { Course, Category } from '@/types';

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, popularRes, categoriesRes] = await Promise.all([
          courseAPI.getAll({ limit: 4, isFeatured: true }),
          courseAPI.getAll({ limit: 8, sort: 'popular' }),
          categoryAPI.getAll({ activeOnly: true }),
        ]);
        setFeaturedCourses(featuredRes.data.data || []);
        setPopularCourses(popularRes.data.data || []);
        setCategories(categoriesRes.data.data?.categories || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: Users, value: '100K+', label: 'Students' },
    { icon: BookOpen, value: '5,000+', label: 'Courses' },
    { icon: Award, value: '500+', label: 'Instructors' },
    { icon: Star, value: '4.8', label: 'Avg. Rating' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Quality Content',
      description: 'Learn from industry experts with hands-on projects and real-world examples.',
    },
    {
      icon: Clock,
      title: 'Learn at Your Pace',
      description: 'Access courses anytime, anywhere. Learn on your schedule.',
    },
    {
      icon: Award,
      title: 'Earn Certificates',
      description: 'Get certified upon course completion. Showcase your skills.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join a community of learners. Get help when you need it.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'EduPlatform helped me transition into tech. The courses are well-structured and the instructors are amazing!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'The quality of courses here is exceptional. I learned more in 3 months than I did in a year of self-study.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'Product Manager',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Excellent platform for professional development. The certificates are recognized by employers.',
      rating: 5,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-secondary-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-400/30 rounded-full blur-3xl" />
        
        <div className="container-custom relative py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                #1 Online Learning Platform
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight">
                Unlock Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                  Potential
                </span> Today
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                Join millions of learners worldwide. Access thousands of courses 
                taught by industry experts and transform your career.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-primary-700 hover:bg-gray-100 shadow-xl">
                    Explore Courses
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-white/70" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                  alt="Students learning"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
                {/* Floating Cards */}
                <div className="absolute -left-6 top-20 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Course Completed!</div>
                      <div className="text-sm text-gray-500">Web Development</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-20 bg-white rounded-xl shadow-lg p-4 animate-pulse-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Certificate Earned</div>
                      <div className="text-sm text-gray-500">React Developer</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">Categories</Badge>
            <h2 className="section-title mb-4">Explore Top Categories</h2>
            <p className="section-subtitle mx-auto">
              Choose from hundreds of courses across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.slice(0, 10).map((category, index) => (
              <Link
                key={category._id}
                href={`/courses?category=${category._id}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-hover p-6 text-center"
                >
                  <div className="text-4xl mb-3">{category.icon || '📚'}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.courseCount} courses
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="primary" className="mb-4">Featured</Badge>
              <h2 className="section-title">Featured Courses</h2>
            </div>
            <Link href="/courses?featured=true">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">Why Choose Us</Badge>
            <h2 className="section-title mb-4">Learn Without Limits</h2>
            <p className="section-subtitle mx-auto">
              Everything you need to achieve your learning goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="primary" className="mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </Badge>
              <h2 className="section-title">Popular Courses</h2>
            </div>
            <Link href="/courses?sort=popular">
              <Button variant="outline">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              popularCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-0">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <Rating value={testimonial.rating} size="sm" className="mb-4" />
                <p className="text-white/90 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-white/70">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join our community of learners and start your journey today. 
                Thousands of courses await you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
