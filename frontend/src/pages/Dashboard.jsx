import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock Enrolled Courses
  const enrolledCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp 2025',
      instructorName: 'Angela Yu',
      progress: 45,
      totalLectures: 150,
      completedLectures: 68,
      lastWatched: '2 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
       _id: '2',
       title: 'UI/UX Design Masterclass',
       instructorName: 'Gary Simon',
       progress: 10,
       totalLectures: 80,
       completedLectures: 8,
       lastWatched: '5 hours ago',
       imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-gray-600 mt-2">Ready to continue your learning journey?</p>
      </div>

      {/* Stats/Overview (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-primary rounded-full">
                  <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</h3>
                  <p className="text-sm text-gray-500">Courses Enrolled</p>
              </div>
          </div>
           <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                  <Clock className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">12</h3>
                  <p className="text-sm text-gray-500">Hours Learned</p>
              </div>
          </div>
           <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                  <Award className="w-6 h-6" />
              </div>
              <div>
                  <h3 className="text-2xl font-bold text-gray-900">0</h3>
                  <p className="text-sm text-gray-500">Certificates Earned</p>
              </div>
          </div>
      </div>

      {/* My Learning */}
      <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Learning</h2>
          
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => (
                    <div key={course._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="h-40 overflow-hidden relative">
                             <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Link to={`/courses/${course._id}`} className="bg-white text-gray-900 p-3 rounded-full">
                                    <PlayCircle className="w-8 h-8 fill-primary text-primary" />
                                </Link>
                             </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">{course.instructorName}</p>
                            
                            <div className="mt-auto">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>{course.progress}% Complete</span>
                                    <span>{course.completedLectures}/{course.totalLectures} Lessons</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                                <div className="mt-4">
                                     <button className="w-full py-2 bg-primary text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors">
                                         Continue Learning
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
                <Link to="/courses" className="text-primary font-medium hover:underline">Browse Courses</Link>
            </div>
          )}
      </section>
    </div>
  );
};

export default Dashboard;
