'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search, Filter, Play, Clock, BookOpen, Award,
  CheckCircle, ChevronDown, Calendar
} from 'lucide-react';
import { Button, Badge, ProgressBar, Card, CardContent, Rating } from '@/components/ui';
import { enrollmentAPI } from '@/lib/api';
import { Enrollment, Course } from '@/types';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentAPI.getAll({});
        setEnrollments(response.data.data || []);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const course = enrollment.course as Course;
    const matchesSearch = course?.title
      ?.toLowerCase()
      .includes(search.toLowerCase()) ?? false;

    const progress = enrollment.progress?.percentComplete || 0;
    const matchesFilter =
      filter === 'all' ||
      (filter === 'in_progress' && progress < 100) ||
      (filter === 'completed' && progress >= 100);

    return matchesSearch && matchesFilter;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const stats = {
    all: enrollments.length,
    in_progress: enrollments.filter((e) => (e.progress?.percentComplete || 0) < 100).length,
    completed: enrollments.filter((e) => (e.progress?.percentComplete || 0) >= 100).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Track and manage your enrolled courses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Courses' },
            { key: 'in_progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === item.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label} ({stats[item.key as keyof typeof stats]})
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse flex gap-4">
                  <div className="w-48 h-28 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEnrollments.length > 0 ? (
        <div className="grid gap-4">
          {filteredEnrollments.map((enrollment) => {
            const course = enrollment.course as Course;
            const progress = enrollment.progress?.percentComplete || 0;
            const isCompleted = progress >= 100;

            return (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card hover className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Thumbnail */}
                      <Link href={`/learn/${course._id}`} className="block">
                        <div className="relative w-full md:w-48 h-32 md:h-full">
                          <Image
                            src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                          {isCompleted && (
                            <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center">
                              <div className="text-center text-white">
                                <CheckCircle className="w-8 h-8 mx-auto mb-1" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link href={`/learn/${course._id}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                                {course.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              by {(course.instructor as any)?.name}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                <span>
                                  {enrollment.progress?.completedLessons?.length || 0}/
                                  {course.totalLessons} lessons
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatDuration(enrollment.progress?.totalWatchTime || 0)} watched
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">{progress}%</span>
                              </div>
                              <ProgressBar
                                value={progress}
                                color={isCompleted ? 'success' : 'primary'}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex md:flex-col gap-2">
                            <Link href={`/learn/${course._id}`} className="flex-1 md:flex-none">
                              <Button
                                fullWidth
                                leftIcon={<Play className="w-4 h-4" />}
                                variant={isCompleted ? 'outline' : 'primary'}
                              >
                                {isCompleted ? 'Review' : 'Continue'}
                              </Button>
                            </Link>
                            {isCompleted && enrollment.certificate && (
                              <Link
                                href={`/certificates/${enrollment.certificate}`}
                                className="flex-1 md:flex-none"
                              >
                                <Button
                                  fullWidth
                                  variant="ghost"
                                  leftIcon={<Award className="w-4 h-4" />}
                                >
                                  Certificate
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {search ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {search
                ? 'Try adjusting your search criteria'
                : 'Start your learning journey by enrolling in a course'}
            </p>
            {!search && (
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
