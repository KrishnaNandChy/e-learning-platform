'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, TrendingUp, Play, ArrowRight,
  CheckCircle, Target, Calendar, BarChart3
} from 'lucide-react';
import { Button, Badge, ProgressBar, Card, CardContent } from '@/components/ui';
import { enrollmentAPI, certificateAPI } from '@/lib/api';
import { Enrollment, Certificate } from '@/types';
import { useAuthStore } from '@/store/auth';

export default function StudentDashboardPage() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    inProgress: 0,
    completed: 0,
    totalHours: 0,
    certificates: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollmentsRes, certificatesRes] = await Promise.all([
          enrollmentAPI.getAll({ limit: 6 }),
          certificateAPI.getMy({ limit: 3 }),
        ]);

        const enrollmentsData = enrollmentsRes.data.data || [];
        const certificatesData = certificatesRes.data.data?.certificates || [];

        setEnrollments(enrollmentsData);
        setCertificates(certificatesData);

        // Calculate stats
        const inProgress = enrollmentsData.filter(
          (e: Enrollment) => e.status === 'active' && (e.progress?.percentComplete || 0) < 100
        ).length;
        const completed = enrollmentsData.filter(
          (e: Enrollment) => e.status === 'completed' || (e.progress?.percentComplete || 0) >= 100
        ).length;
        const totalHours = enrollmentsData.reduce(
          (acc: number, e: Enrollment) => acc + (e.progress?.totalWatchTime || 0) / 60,
          0
        );

        setStats({
          totalCourses: enrollmentsData.length,
          inProgress,
          completed,
          totalHours: Math.round(totalHours),
          certificates: certificatesData.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Enrolled Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Certificates', value: stats.certificates, icon: Award, color: 'bg-purple-500' },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Track your progress and continue learning
          </p>
        </div>
        <Link href="/courses">
          <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
            Browse Courses
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
          <Link href="/dashboard/courses" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-32 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-2 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : enrollments.length > 0 ? (
          <div className="grid gap-4">
            {enrollments
              .filter((e) => e.status === 'active' && (e.progress?.percentComplete || 0) < 100)
              .slice(0, 3)
              .map((enrollment) => {
                const course = enrollment.course as any;
                return (
                  <Link key={enrollment._id} href={`/learn/${course._id}`}>
                    <Card hover className="transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {course.instructor?.name}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <ProgressBar
                                value={enrollment.progress?.percentComplete || 0}
                                className="flex-1 h-2"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {enrollment.progress?.percentComplete || 0}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button variant="ghost" size="sm" leftIcon={<Play className="w-4 h-4" />}>
                              Resume
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Certificates */}
      {certificates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Certificates</h2>
            <Link href="/dashboard/certificates" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {certificates.map((certificate) => (
              <Card key={certificate._id} hover>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {certificate.courseName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Issued {new Date(certificate.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/certificates/${certificate.certificateId}`} className="flex-1">
                      <Button variant="outline" fullWidth size="sm">
                        View
                      </Button>
                    </Link>
                    <a href={certificate.file?.url || '#'} download className="flex-1">
                      <Button variant="primary" fullWidth size="sm">
                        Download
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Learning Goals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Weekly Goal
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Hours studied this week</span>
                  <span className="font-medium text-gray-900">{stats.totalHours}/10 hours</span>
                </div>
                <ProgressBar value={(stats.totalHours / 10) * 100} color="primary" />
              </div>
              <p className="text-sm text-gray-500">
                {stats.totalHours >= 10
                  ? '🎉 Great job! You have reached your weekly goal!'
                  : `Keep going! ${10 - stats.totalHours} hours left to reach your goal.`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Learning Streak
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary-600">7</div>
              <div>
                <p className="font-medium text-gray-900">Days in a row</p>
                <p className="text-sm text-gray-500">Keep it up! 🔥</p>
              </div>
            </div>
            <div className="flex gap-1 mt-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div
                  key={day + i}
                  className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                    i < 7 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
