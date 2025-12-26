'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search, Plus, Filter, MoreVertical, Users, Star, Clock,
  Eye, Edit, Trash2, ChevronDown, BookOpen, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Badge, Card, CardContent, Modal, Rating } from '@/components/ui';
import { courseAPI } from '@/lib/api';
import { Course } from '@/types';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending_review' | 'published' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; course: Course | null }>({
    open: false,
    course: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getInstructorCourses({});
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.course) return;

    try {
      await courseAPI.delete(deleteModal.course._id);
      setCourses(courses.filter((c) => c._id !== deleteModal.course?._id));
      toast.success('Course deleted successfully');
      setDeleteModal({ open: false, course: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || course.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    all: courses.length,
    draft: courses.filter((c) => c.status === 'draft').length,
    pending_review: courses.filter((c) => c.status === 'pending_review').length,
    published: courses.filter((c) => c.status === 'published').length,
    rejected: courses.filter((c) => c.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      draft: 'default',
      pending_review: 'warning',
      published: 'success',
      rejected: 'error',
    };
    const displayStatus = status === 'pending_review' ? 'pending' : status;
    return <Badge variant={variants[status] || 'default'}>{displayStatus}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">Manage and create your courses</p>
        </div>
        <Link href="/instructor/courses/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Create New Course
          </Button>
        </Link>
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

        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'draft', label: 'Draft' },
            { key: 'pending_review', label: 'Pending' },
            { key: 'published', label: 'Published' },
            { key: 'rejected', label: 'Rejected' },
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

      {/* Course Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <div className="animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover className="overflow-hidden h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <Image
                    src={course.thumbnail?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(course.status)}
                  </div>
                  {course.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="warning">Featured</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <Link href={`/instructor/courses/${course._id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.totalLessons} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      {course.enrollmentCount} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-700 font-medium">{course.averageRating.toFixed(1)}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="font-semibold text-gray-900">
                      {course.isFree ? 'Free' : `₹${course.price.toLocaleString()}`}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                          Preview
                        </Button>
                      </Link>
                      <Link href={`/instructor/courses/${course._id}/edit`}>
                        <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {search || filter !== 'all' ? 'No courses found' : 'No courses yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {search || filter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first course and start teaching'}
            </p>
            {!search && filter === 'all' && (
              <Link href="/instructor/courses/new">
                <Button>Create Your First Course</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, course: null })}
        title="Delete Course"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{deleteModal.course?.title}"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, course: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Course
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
