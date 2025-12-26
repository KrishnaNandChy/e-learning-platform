'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, DollarSign, Star, TrendingUp, Eye,
  ArrowRight, Plus, Clock, BarChart3, MessageSquare
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Avatar, Rating, ProgressBar } from '@/components/ui';
import { courseAPI, enrollmentAPI, doubtAPI } from '@/lib/api';
import { Course, Doubt } from '@/types';
import { useAuthStore } from '@/store/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function InstructorDashboardPage() {
  const { user, instructorProfile } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalEarnings: 0,
    averageRating: 0,
    thisMonthEarnings: 0,
    pendingDoubts: 0,
  });

  // Sample chart data
  const chartData = [
    { name: 'Jan', students: 40, earnings: 2400 },
    { name: 'Feb', students: 30, earnings: 1398 },
    { name: 'Mar', students: 60, earnings: 4800 },
    { name: 'Apr', students: 80, earnings: 3908 },
    { name: 'May', students: 50, earnings: 4800 },
    { name: 'Jun', students: 90, earnings: 3800 },
    { name: 'Jul', students: 120, earnings: 4300 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, doubtsRes] = await Promise.all([
          courseAPI.getInstructorCourses({ limit: 5 }),
          doubtAPI.getInstructorDoubts({ status: 'open', limit: 5 }),
        ]);

        setCourses(coursesRes.data.data || []);
        setDoubts(doubtsRes.data.data?.doubts || []);

        // Calculate stats from instructor profile and courses
        const coursesData = coursesRes.data.data || [];
        const totalStudents = coursesData.reduce((acc: number, c: Course) => acc + (c.enrollmentCount || 0), 0);
        const totalRatings = coursesData.reduce((acc: number, c: Course) => acc + (c.averageRating || 0), 0);
        
        setStats({
          totalStudents,
          totalCourses: coursesData.length,
          totalEarnings: instructorProfile?.totalEarnings || 0,
          averageRating: coursesData.length > 0 ? totalRatings / coursesData.length : 0,
          thisMonthEarnings: 4500, // Placeholder
          pendingDoubts: doubtsRes.data.data?.pagination?.totalItems || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instructorProfile]);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { label: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'bg-green-500', change: '+2' },
    { label: 'Total Earnings', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-500', change: '+8%' },
    { label: 'Avg. Rating', value: stats.averageRating.toFixed(1), icon: Star, color: 'bg-yellow-500', change: '+0.2' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your courses
          </p>
        </div>
        <Link href="/instructor/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create New Course
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
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="success" size="sm" className="bg-green-100 text-green-700">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-4">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Earnings Overview</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <option>Last 7 months</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Students Chart */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Student Enrollment</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <option>Last 7 months</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses and Doubts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Your Courses</h3>
              <Link href="/instructor/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-20 h-14 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length > 0 ? (
              <div className="space-y-4">
                {courses.slice(0, 4).map((course) => (
                  <Link
                    key={course._id}
                    href={`/instructor/courses/${course._id}`}
                    className="flex gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {course.enrollmentCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                          {course.averageRating.toFixed(1)}
                        </span>
                        <Badge
                          variant={course.status === 'published' ? 'success' : course.status === 'pending_review' ? 'warning' : 'default'}
                          size="sm"
                        >
                          {course.status === 'pending_review' ? 'pending' : course.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No courses yet</p>
                <Link href="/instructor/courses/new">
                  <Button variant="outline" className="mt-4">
                    Create Your First Course
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Doubts */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Pending Doubts</h3>
                {stats.pendingDoubts > 0 && (
                  <Badge variant="error" size="sm">{stats.pendingDoubts}</Badge>
                )}
              </div>
              <Link href="/instructor/doubts" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : doubts.length > 0 ? (
              <div className="space-y-4">
                {doubts.slice(0, 4).map((doubt) => (
                  <Link
                    key={doubt._id}
                    href={`/instructor/doubts/${doubt._id}`}
                    className="block p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar src={doubt.user?.avatar?.url} name={doubt.user?.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{doubt.title}</h4>
                        <p className="text-sm text-gray-500 truncate mt-0.5">
                          by {doubt.user?.name} • {doubt.course?.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={doubt.status === 'open' ? 'error' : doubt.status === 'answered' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {doubt.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(doubt.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No pending doubts</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Create Course', icon: Plus, href: '/instructor/courses/new', color: 'bg-primary-600' },
          { label: 'View Analytics', icon: BarChart3, href: '/instructor/analytics', color: 'bg-blue-600' },
          { label: 'Manage Students', icon: Users, href: '/instructor/students', color: 'bg-green-600' },
          { label: 'Check Earnings', icon: DollarSign, href: '/instructor/earnings', color: 'bg-purple-600' },
        ].map((action) => (
          <Link key={action.label} href={action.href}>
            <Card hover className="h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">Quick access</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
