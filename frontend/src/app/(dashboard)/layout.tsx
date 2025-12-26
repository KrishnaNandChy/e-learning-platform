'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, LayoutDashboard, GraduationCap, Award, MessageSquare,
  FileText, Settings, LogOut, Bell, Menu, X, ChevronDown,
  Users, BarChart3, DollarSign, Shield, HelpCircle, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Avatar, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/store/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, fetchUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) {
        await fetchUser();
      }
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=' + pathname);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  // Navigation items based on user role
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    if (user.role === 'student') {
      return [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'My Courses', href: '/dashboard/courses', icon: GraduationCap },
        { label: 'Certificates', href: '/dashboard/certificates', icon: Award },
        { label: 'My Doubts', href: '/dashboard/doubts', icon: MessageSquare },
        { label: 'My Notes', href: '/dashboard/notes', icon: FileText },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];
    }

    if (user.role === 'instructor') {
      return [
        { label: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
        { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
        { label: 'Students', href: '/instructor/students', icon: Users },
        { label: 'Doubts', href: '/instructor/doubts', icon: MessageSquare },
        { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
        { label: 'Earnings', href: '/instructor/earnings', icon: DollarSign },
        { label: 'Settings', href: '/instructor/settings', icon: Settings },
      ];
    }

    if (user.role === 'admin' || user.role === 'admin_helper') {
      return [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Users', href: '/admin/users', icon: Users },
        { label: 'Instructors', href: '/admin/instructors', icon: Briefcase },
        { label: 'Courses', href: '/admin/courses', icon: BookOpen },
        { label: 'Categories', href: '/admin/categories', icon: GraduationCap },
        { label: 'Payments', href: '/admin/payments', icon: DollarSign },
        { label: 'Certificates', href: '/admin/certificates', icon: Award },
        { label: 'Doubts', href: '/admin/doubts', icon: MessageSquare },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return <Badge variant="error" size="sm">Admin</Badge>;
      case 'admin_helper':
        return <Badge variant="warning" size="sm">Admin Helper</Badge>;
      case 'instructor':
        return <Badge variant="primary" size="sm">Instructor</Badge>;
      default:
        return <Badge variant="info" size="sm">Student</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold font-display gradient-text">EduPlatform</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="primary" size="sm" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
              <Avatar src={user.avatar?.url} name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <div className="mt-0.5">{getRoleBadge()}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <Link href="/help" className="p-2 rounded-lg hover:bg-gray-100">
              <HelpCircle className="w-5 h-5 text-gray-500" />
            </Link>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
              <Avatar src={user.avatar?.url} name={user.name} size="sm" />
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
