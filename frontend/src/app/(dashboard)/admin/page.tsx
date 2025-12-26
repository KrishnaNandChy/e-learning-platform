'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, DollarSign, TrendingUp, Award, Clock,
  UserPlus, FileText, MessageSquare, ShieldCheck, ArrowUpRight,
  ArrowDownRight, AlertCircle
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Avatar } from '@/components/ui';
import { adminAPI, courseAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalEnrollments: number;
  totalCertificates: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingCourses, setPendingCourses] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample chart data
  const revenueData = [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
    { name: 'Jul', revenue: 72000 },
  ];

  const userGrowthData = [
    { name: 'Jan', users: 120 },
    { name: 'Feb', users: 180 },
    { name: 'Mar', users: 250 },
    { name: 'Apr', users: 320 },
    { name: 'May', users: 410 },
    { name: 'Jun', users: 480 },
    { name: 'Jul', users: 560 },
  ];

  const courseDistribution = [
    { name: 'Published', value: 45, color: '#10b981' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Draft', value: 23, color: '#6b7280' },
    { name: 'Rejected', value: 5, color: '#ef4444' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pendingRes, usersRes] = await Promise.all([
          adminAPI.getDashboardStats(),
          courseAPI.getPendingCourses({ limit: 5 }),
          adminAPI.getUsers({ limit: 5, sort: '-createdAt' }),
        ]);

        setStats(statsRes.data.data);
        setPendingCourses(pendingRes.data.data?.courses || []);
        setRecentUsers(usersRes.data.data?.users || []);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'up',
    },
    {
      label: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'up',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'up',
    },
    {
      label: 'Enrollments',
      value: stats?.totalEnrollments || 0,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+18%',
      changeType: 'up',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}. Here's your platform overview.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/instructors/new">
            <Button variant="outline" leftIcon={<UserPlus className="w-4 h-4" />}>
              Add Instructor
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button leftIcon={<TrendingUp className="w-4 h-4" />}>
              View Analytics
            </Button>
          </Link>
        </div>
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
                  <Badge
                    variant={stat.changeType === 'up' ? 'success' : 'error'}
                    size="sm"
                    className={stat.changeType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                  >
                    {stat.changeType === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
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
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5">
                <option>Last 7 months</option>
                <option>Last 12 months</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Course Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                  >
                    {courseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {courseDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900 ml-auto">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Courses & Recent Users */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Courses */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Pending Approval</h3>
                {stats?.pendingCourses && stats.pendingCourses > 0 && (
                  <Badge variant="warning">{stats.pendingCourses}</Badge>
                )}
              </div>
              <Link href="/admin/courses?status=pending" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-16 h-12 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingCourses.length > 0 ? (
              <div className="space-y-4">
                {pendingCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-16 h-12 bg-gray-200 rounded overflow-hidden">
                      {course.thumbnail && (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                      <p className="text-sm text-gray-500">
                        by {course.instructor?.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/courses/${course._id}`}>
                        <Button variant="outline" size="sm">Review</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">No courses pending approval</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">Recent Users</h3>
              <Link href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Badge
                      variant={user.role === 'instructor' ? 'primary' : user.role === 'admin' ? 'error' : 'default'}
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No recent users</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'bg-blue-600' },
          { label: 'Review Courses', icon: BookOpen, href: '/admin/courses', color: 'bg-green-600' },
          { label: 'Payments', icon: DollarSign, href: '/admin/payments', color: 'bg-purple-600' },
          { label: 'Certificates', icon: Award, href: '/admin/certificates', color: 'bg-orange-600' },
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
