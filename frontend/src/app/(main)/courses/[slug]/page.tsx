'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play, Clock, BookOpen, Users, Award, Star, Check,
  ChevronDown, ChevronRight, Lock, PlayCircle, FileText,
  HelpCircle, Download, Share2, Heart, ShoppingCart, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Badge, Rating, Avatar, ProgressBar } from '@/components/ui';
import { courseAPI, enrollmentAPI } from '@/lib/api';
import { Course, Lesson } from '@/types';
import { useAuthStore } from '@/store/auth';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseAPI.getBySlug(params.slug as string);
        setCourse(response.data.data);
        
        // Check enrollment status
        if (isAuthenticated && user) {
          try {
            const enrollmentRes = await enrollmentAPI.getAll({ courseId: response.data.data._id });
            setIsEnrolled(enrollmentRes.data.data?.length > 0);
          } catch {
            setIsEnrolled(false);
          }
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Course not found');
        router.push('/courses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [params.slug, isAuthenticated, user]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/courses/${params.slug}`);
      return;
    }

    if (!course) return;

    setEnrolling(true);
    try {
      if (course.isFree) {
        await enrollmentAPI.enrollFree(course._id);
        toast.success('Successfully enrolled!');
        setIsEnrolled(true);
        router.push(`/learn/${course._id}`);
      } else {
        // Redirect to payment
        router.push(`/checkout/${course._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gray-900 py-16">
          <div className="container-custom">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-4" />
              <div className="h-12 bg-gray-700 rounded w-2/3 mb-6" />
              <div className="h-6 bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const effectivePrice = course.discountPrice || course.price;
  const hasDiscount = course.discountPrice && course.discountPrice < course.price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="primary">{course.category?.name || 'Course'}</Badge>
                {course.isFeatured && (
                  <Badge variant="warning">Featured</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Rating value={course.averageRating} size="sm" />
                  <span className="text-yellow-400 font-medium">{course.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400">({course.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollmentCount.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Link href={`/instructor/${course.instructor?._id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Avatar
                    src={course.instructor?.avatar?.url}
                    name={course.instructor?.name}
                    size="md"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="font-medium">{course.instructor?.name}</p>
                  </div>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Certificate included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                </div>
              </div>
            </div>

            {/* Course Card (Desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden sticky top-24">
                <div className="aspect-video relative">
                  <Image
                    src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {course.promoVideo && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-gray-900 ml-1" />
                      </div>
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    {course.isFree ? (
                      <span className="text-3xl font-bold text-green-600">Free</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{effectivePrice.toLocaleString()}
                        </span>
                        {hasDiscount && (
                          <>
                            <span className="text-lg text-gray-400 line-through">
                              ₹{course.price.toLocaleString()}
                            </span>
                            <Badge variant="success">
                              {Math.round((1 - effectivePrice / course.price) * 100)}% off
                            </Badge>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Link href={`/learn/${course._id}`}>
                      <Button fullWidth size="lg" leftIcon={<Play className="w-5 h-5" />}>
                        Continue Learning
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      fullWidth
                      size="lg"
                      onClick={handleEnroll}
                      isLoading={enrolling}
                      leftIcon={course.isFree ? <BookOpen className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    >
                      {course.isFree ? 'Enroll Now - Free' : 'Buy Now'}
                    </Button>
                  )}

                  <p className="text-center text-sm text-gray-500 mt-4">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">This course includes:</h4>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-gray-400" />
                        {formatDuration(course.totalDuration)} on-demand video
                      </li>
                      <li className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {course.totalLessons} lessons
                      </li>
                      <li className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-gray-400" />
                        Downloadable resources
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-gray-400" />
                        Certificate of completion
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" fullWidth leftIcon={<Share2 className="w-4 h-4" />}>
                      Share
                    </Button>
                    <Button variant="outline" fullWidth leftIcon={<Heart className="w-4 h-4" />}>
                      Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            {course.isFree ? (
              <span className="text-xl font-bold text-green-600">Free</span>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ₹{effectivePrice.toLocaleString()}
              </span>
            )}
          </div>
          {isEnrolled ? (
            <Link href={`/learn/${course._id}`} className="flex-1">
              <Button fullWidth leftIcon={<Play className="w-5 h-5" />}>
                Continue Learning
              </Button>
            </Link>
          ) : (
            <Button
              className="flex-1"
              onClick={handleEnroll}
              isLoading={enrolling}
            >
              {course.isFree ? 'Enroll Now' : 'Buy Now'}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-20 z-30">
        <div className="container-custom">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'instructor', label: 'Instructor' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8 pb-32 lg:pb-8">
        <div className="lg:w-2/3">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* What you'll learn */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn?.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Description */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
                </div>
              </section>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Target Audience */}
              {course.targetAudience && course.targetAudience.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Who this course is for</h2>
                  <ul className="space-y-2">
                    {course.targetAudience.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-gray-600">
                    {course.curriculum?.length || 0} sections • {course.totalLessons} lessons • {formatDuration(course.totalDuration)} total
                  </span>
                </div>
                <button
                  onClick={() => setExpandedSections(expandedSections.length === course.curriculum?.length ? [] : course.curriculum?.map((_, i) => i) || [])}
                  className="text-sm text-primary-600 font-medium hover:text-primary-700"
                >
                  {expandedSections.length === course.curriculum?.length ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              <div className="space-y-4">
                {course.curriculum?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(sectionIndex)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedSections.includes(sectionIndex) ? 'rotate-180' : ''
                          }`}
                        />
                        <span className="font-semibold text-gray-900">{section.sectionTitle}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {section.lessons?.length || 0} lessons
                      </span>
                    </button>

                    {expandedSections.includes(sectionIndex) && (
                      <div className="divide-y divide-gray-100">
                        {section.lessons?.map((lesson: any, lessonIndex: number) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isFreePreview ? (
                                <PlayCircle className="w-4 h-4 text-primary-600" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-400" />
                              )}
                              <span className="text-gray-700">{lesson.title}</span>
                              {lesson.isFreePreview && (
                                <Badge variant="primary" size="sm">Preview</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDuration(lesson.duration || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-6">
                <Avatar
                  src={course.instructor?.avatar?.url}
                  name={course.instructor?.name}
                  size="xl"
                />
                <div className="flex-1">
                  <Link href={`/instructor/${course.instructor?._id}`}>
                    <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                      {course.instructor?.name}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-1">{course.instructor?.bio || 'Expert instructor'}</p>
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.5 rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{course.totalReviews || 0} reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount?.toLocaleString() || 0} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600">{course.instructor?.bio || 'Experienced instructor dedicated to helping students succeed.'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {course.averageRating.toFixed(1)}
                  </div>
                  <Rating value={course.averageRating} size="lg" className="mt-2" />
                  <div className="text-sm text-gray-500 mt-1">
                    {course.totalReviews} reviews
                  </div>
                </div>
                
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-12">{star} star</span>
                      <ProgressBar
                        value={Math.random() * 100}
                        className="flex-1 h-2"
                        color="warning"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center py-12 text-gray-500">
                Reviews will be displayed here
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
