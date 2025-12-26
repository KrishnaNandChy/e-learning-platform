import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card, Badge, ProgressBar, Avatar } from '../components/ui';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('learning');

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: 'student',
    joinedDate: 'January 2024',
    coursesCompleted: 12,
    coursesInProgress: 5,
    totalHours: 248,
    certificates: 8,
  };

  // Mock enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp 2024',
      instructor: 'John Doe',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      progress: 65,
      lastAccessed: '2 hours ago',
      nextLesson: 'Advanced JavaScript Concepts',
      totalLessons: 234,
      completedLessons: 152,
      duration: '52 hours',
      category: 'Development',
    },
    {
      id: 2,
      title: 'Machine Learning A-Z: AI, Python & R',
      instructor: 'Jane Smith',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
      progress: 42,
      lastAccessed: '1 day ago',
      nextLesson: 'Neural Networks Introduction',
      totalLessons: 198,
      completedLessons: 83,
      duration: '44 hours',
      category: 'Data Science',
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Mike Johnson',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
      progress: 88,
      lastAccessed: '3 days ago',
      nextLesson: 'Final Project Review',
      totalLessons: 156,
      completedLessons: 137,
      duration: '36 hours',
      category: 'Design',
    },
  ];

  // Mock completed courses
  const completedCourses = [
    {
      id: 4,
      title: 'Digital Marketing Mastery 2024',
      instructor: 'Sarah Williams',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      completedDate: 'Dec 15, 2024',
      certificate: true,
      rating: 5,
      duration: '28 hours',
      category: 'Marketing',
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'Robert Brown',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
      completedDate: 'Nov 28, 2024',
      certificate: true,
      rating: 4,
      duration: '32 hours',
      category: 'Data Science',
    },
  ];

  // Mock recommended courses
  const recommendedCourses = [
    {
      id: 6,
      title: 'React Advanced Patterns',
      instructor: 'Alex Turner',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
      rating: 4.9,
      students: 45200,
      price: 89.99,
      category: 'Development',
    },
    {
      id: 7,
      title: 'Node.js Microservices',
      instructor: 'Emma Wilson',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
      rating: 4.8,
      students: 32100,
      price: 94.99,
      category: 'Development',
    },
  ];

  const stats = [
    {
      label: 'Courses Completed',
      value: user.coursesCompleted,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-success-100 text-success-600',
    },
    {
      label: 'In Progress',
      value: user.coursesInProgress,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'Total Hours',
      value: user.totalHours,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-warning-100 text-warning-600',
    },
    {
      label: 'Certificates',
      value: user.certificates,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'bg-secondary-100 text-secondary-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar src={user.avatar} alt={user.name} size="xl" />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-primary-100">Ready to continue your learning journey?</p>
            </div>
            <Link to="/courses">
              <Button variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-custom -mt-8 mb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <Card.Body>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom pb-16">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('learning')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'learning'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Learning
              {activeTab === 'learning' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'completed'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
              {activeTab === 'completed' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'wishlist'
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Wishlist
              {activeTab === 'wishlist' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'learning' && (
          <div className="space-y-8">
            {/* Continue Learning Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} hover className="bg-white">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <Card.Body className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <span className="text-sm text-gray-500">{course.lastAccessed}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600">By {course.instructor}</p>
                      
                      <div className="space-y-2">
                        <ProgressBar value={course.progress} showLabel={true} />
                        <p className="text-sm text-gray-600">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>Next:</strong> {course.nextLesson}
                        </p>
                        <Link to={`/courses/${course.id}/learn`}>
                          <Button variant="primary" fullWidth>
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                <Link to="/courses">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {recommendedCourses.map((course) => (
                  <Card key={course.id} hover className="bg-white">
                    <div className="flex gap-4">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-32 h-32 object-cover rounded-l-xl"
                      />
                      <div className="flex-1 p-4">
                        <Badge variant="primary" className="mb-2">{course.category}</Badge>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">By {course.instructor}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-warning-400">★</span>
                            <span className="font-semibold">{course.rating}</span>
                            <span className="text-sm text-gray-500">
                              ({course.students.toLocaleString()})
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">${course.price}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'completed' && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <Card key={course.id} hover className="bg-white">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <Card.Body className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Completed</Badge>
                      <Badge variant="secondary">{course.category}</Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600">By {course.instructor}</p>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < course.rating ? 'text-warning-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Completed on {course.completedDate}
                    </p>
                    
                    <div className="pt-4 border-t border-gray-200 flex gap-2">
                      {course.certificate && (
                        <Button variant="primary" fullWidth>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Certificate
                        </Button>
                      )}
                      <Link to={`/courses/${course.id}`} className="flex-1">
                        <Button variant="outline" fullWidth>Review</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'wishlist' && (
          <section>
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Explore courses and add them to your wishlist</p>
              <Link to="/courses">
                <Button variant="primary">Browse Courses</Button>
              </Link>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
