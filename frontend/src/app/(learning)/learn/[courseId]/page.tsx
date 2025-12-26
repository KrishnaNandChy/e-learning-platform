'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Play, Pause, Check, Lock, Menu, X, FileText, Download,
  MessageSquare, StickyNote, Award, Clock, SkipForward, Settings,
  Maximize, Volume2, VolumeX
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Badge, ProgressBar, Avatar } from '@/components/ui';
import { courseAPI, lessonAPI, enrollmentAPI, progressAPI } from '@/lib/api';
import { Course, Lesson, Enrollment } from '@/types';
import { useAuthStore } from '@/store/auth';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const playerRef = useRef<any>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  
  // Video player state
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'doubts' | 'resources'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=/learn/' + params.courseId);
        return;
      }

      try {
        const [courseRes, enrollmentRes] = await Promise.all([
          courseAPI.getById(params.courseId as string),
          enrollmentAPI.getByCourse(params.courseId as string),
        ]);

        const courseData = courseRes.data.data;
        const enrollmentData = enrollmentRes.data.data;

        if (!enrollmentData) {
          toast.error('You are not enrolled in this course');
          router.push(`/courses/${courseData.slug}`);
          return;
        }

        setCourse(courseData);
        setEnrollment(enrollmentData);

        // Set initial lesson
        const lessonId = searchParams.get('lesson');
        let initialLesson = null;

        if (lessonId) {
          // Find lesson by ID
          for (const section of courseData.curriculum || []) {
            const found = section.lessons?.find((l: any) => l._id === lessonId);
            if (found) {
              initialLesson = found;
              break;
            }
          }
        }

        if (!initialLesson) {
          // Use current lesson from enrollment or first lesson
          const currentLessonId = enrollmentData.progress?.currentLesson;
          if (currentLessonId) {
            for (const section of courseData.curriculum || []) {
              const found = section.lessons?.find((l: any) => l._id === currentLessonId);
              if (found) {
                initialLesson = found;
                break;
              }
            }
          }
        }

        if (!initialLesson && courseData.curriculum?.[0]?.lessons?.[0]) {
          initialLesson = courseData.curriculum[0].lessons[0];
        }

        if (initialLesson) {
          setCurrentLesson(initialLesson);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
        router.push('/dashboard/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.courseId, isAuthenticated, router, searchParams]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.progress?.completedLessons?.includes(lessonId) || false;
  };

  const selectLesson = async (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setPlaying(false);
    setProgress(0);
    
    // Update URL without navigation
    window.history.replaceState(null, '', `/learn/${params.courseId}?lesson=${lesson._id}`);
  };

  const handleProgress = async (state: { played: number; playedSeconds: number }) => {
    setProgress(state.played * 100);

    // Update progress on server every 10 seconds
    if (currentLesson && state.playedSeconds > 0 && Math.floor(state.playedSeconds) % 10 === 0) {
      try {
        await progressAPI.updateProgress(currentLesson._id, {
          watchedDuration: Math.floor(state.playedSeconds),
          lastPosition: Math.floor(state.playedSeconds),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !enrollment) return;

    try {
      await progressAPI.markComplete(currentLesson._id);
      
      // Update local state
      setEnrollment((prev) => {
        if (!prev) return prev;
        const completedLessons = [...(prev.progress?.completedLessons || [])];
        if (!completedLessons.includes(currentLesson._id)) {
          completedLessons.push(currentLesson._id);
        }
        return {
          ...prev,
          progress: {
            ...prev.progress,
            completedLessons,
            percentComplete: Math.round((completedLessons.length / (course?.totalLessons || 1)) * 100),
          },
        };
      });

      toast.success('Lesson completed!');

      // Auto-play next lesson
      const nextLesson = getNextLesson();
      if (nextLesson) {
        selectLesson(nextLesson);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getNextLesson = () => {
    if (!course || !currentLesson) return null;

    let foundCurrent = false;
    for (const section of course.curriculum || []) {
      for (const lesson of section.lessons || []) {
        if (foundCurrent) return lesson;
        if (lesson._id === currentLesson._id) foundCurrent = true;
      }
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course || !currentLesson) return null;

    let previousLesson = null;
    for (const section of course.curriculum || []) {
      for (const lesson of section.lessons || []) {
        if (lesson._id === currentLesson._id) return previousLesson;
        previousLesson = lesson;
      }
    }
    return null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!course || !enrollment) return null;

  const overallProgress = enrollment.progress?.percentComplete || 0;
  const completedLessons = enrollment.progress?.completedLessons?.length || 0;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed lg:relative z-40 w-80 bg-white h-screen flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Link href="/dashboard/courses" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">Back to courses</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h2>
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    {completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span className="font-medium">{overallProgress}%</span>
                </div>
                <ProgressBar value={overallProgress} className="h-2" />
              </div>
            </div>

            {/* Course Content */}
            <div className="flex-1 overflow-y-auto">
              {course.curriculum?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{section.sectionTitle}</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {section.lessons?.filter((l: any) => isLessonCompleted(l._id)).length || 0}/
                        {section.lessons?.length || 0} lessons
                      </p>
                    </div>
                    {expandedSections.includes(sectionIndex) ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.includes(sectionIndex) && (
                    <div className="pb-2">
                      {section.lessons?.map((lesson: any, lessonIndex: number) => {
                        const isActive = currentLesson?._id === lesson._id;
                        const isCompleted = isLessonCompleted(lesson._id);

                        return (
                          <button
                            key={lesson._id}
                            onClick={() => selectLesson(lesson)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              isActive
                                ? 'bg-primary-50 border-l-4 border-primary-600'
                                : 'hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isActive
                                  ? 'bg-primary-600 text-white'
                                  : 'border-2 border-gray-300'
                              }`}
                            >
                              {isCompleted ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <span className="text-xs">{lessonIndex + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm truncate ${
                                  isActive ? 'text-primary-700 font-medium' : 'text-gray-700'
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {lesson.type === 'video' && (
                                  <Play className="w-3 h-3 text-gray-400" />
                                )}
                                {lesson.type === 'text' && (
                                  <FileText className="w-3 h-3 text-gray-400" />
                                )}
                                <span className="text-xs text-gray-400">
                                  {lesson.duration ? formatTime(lesson.duration * 60) : '5:00'}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-700 text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-white font-medium truncate max-w-md">
              {currentLesson?.title || 'Select a lesson'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!getPreviousLesson()}
              onClick={() => getPreviousLesson() && selectLesson(getPreviousLesson()!)}
              className="text-white hover:bg-gray-700"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!getNextLesson()}
              onClick={() => getNextLesson() && selectLesson(getNextLesson()!)}
              className="text-white hover:bg-gray-700"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Video Player Area */}
        <div className="bg-black flex-1 flex items-center justify-center">
          {currentLesson?.type === 'video' && currentLesson.content?.video?.url ? (
            <div className="w-full aspect-video max-h-[70vh] relative">
              <ReactPlayer
                ref={playerRef}
                url={currentLesson.content.video.url}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={setDuration}
                onEnded={handleLessonComplete}
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            </div>
          ) : currentLesson?.type === 'text' ? (
            <div className="max-w-3xl mx-auto p-8 text-white">
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.content?.text || '' }} />
              </div>
              <div className="mt-8 text-center">
                <Button onClick={handleLessonComplete}>
                  Mark as Complete
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a lesson to start learning</p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="bg-white border-t border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-4">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'notes', label: 'Notes', icon: StickyNote },
                { id: 'doubts', label: 'Q&A', icon: MessageSquare },
                { id: 'resources', label: 'Resources', icon: Download },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 max-h-64 overflow-y-auto">
            {activeTab === 'overview' && currentLesson && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{currentLesson.title}</h3>
                <p className="text-gray-600">{currentLesson.description || 'No description available.'}</p>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="text-center py-8">
                <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Take notes while watching the lesson</p>
                <Button variant="outline" className="mt-4">
                  Add Note
                </Button>
              </div>
            )}

            {activeTab === 'doubts' && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Ask questions and get help from instructors</p>
                <Button variant="outline" className="mt-4">
                  Ask a Question
                </Button>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                  <ul className="space-y-2">
                    {currentLesson.resources.map((resource: any, index: number) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          download
                          className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <Download className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{resource.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <Download className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No resources available for this lesson</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
