'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, BookOpen, Star } from 'lucide-react';
import { Course } from '@/types';
import { Badge, Avatar, Rating } from '@/components/ui';

interface CourseCardProps {
  course: Course;
  showInstructor?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showInstructor = true }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="card-hover group h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={course.thumbnail?.url || '/images/course-placeholder.jpg'}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {course.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge variant="primary">Featured</Badge>
            </div>
          )}
          {course.discountPrice && course.discountValidUntil && new Date(course.discountValidUntil) > new Date() && (
            <div className="absolute top-3 right-3">
              <Badge variant="error">
                {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Category & Level */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" size="sm">
              {typeof course.category === 'object' ? course.category.name : 'Course'}
            </Badge>
            <Badge variant={getLevelColor(course.level)} size="sm">
              {course.level.replace('_', ' ')}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          {showInstructor && course.instructor && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar
                src={typeof course.instructor === 'object' ? course.instructor.avatar?.url : undefined}
                name={typeof course.instructor === 'object' ? course.instructor.name : 'Instructor'}
                size="xs"
              />
              <span className="text-sm text-gray-600">
                {typeof course.instructor === 'object' ? course.instructor.name : 'Instructor'}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.totalLessons} lessons</span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <Rating value={course.averageRating} size="sm" showValue />
            <span className="text-sm text-gray-500">
              ({course.totalReviews.toLocaleString()})
            </span>
          </div>

          {/* Enrollment Count */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <Users className="w-4 h-4" />
            <span>{course.enrollmentCount.toLocaleString()} students</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            {course.isFree ? (
              <span className="text-lg font-bold text-green-600">Free</span>
            ) : (
              <div className="flex items-center gap-2">
                {course.discountPrice && course.discountValidUntil && new Date(course.discountValidUntil) > new Date() ? (
                  <>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{course.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{course.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    ₹{course.price.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
