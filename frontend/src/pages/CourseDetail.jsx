import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card, Badge, Rating, Avatar } from '../components/ui';

const CourseDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({});

  // Mock course data
  const course = {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    subtitle: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps',
    instructor: {
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=13',
      title: 'Web Development Expert',
      students: 250000,
      courses: 8,
      rating: 4.8,
      bio: 'Full-stack developer with 10+ years of experience. Passionate about teaching and helping students achieve their goals.',
    },
    rating: 4.8,
    reviews: 15420,
    students: 89340,
    price: 84.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    category: 'Development',
    level: 'Beginner',
    duration: '52 hours',
    lastUpdated: 'December 2024',
    language: 'English',
    bestseller: true,
    description: `This comprehensive course will take you from beginner to advanced in web development. You'll learn everything you need to become a professional full-stack developer.

No prior experience is required - this course starts from the absolute basics and gradually builds up your skills. By the end of the course, you'll have built multiple real-world projects and be ready for junior developer positions.`,
    
    whatYouWillLearn: [
      'Build 16 web development projects for your portfolio',
      'Learn the latest technologies, including JavaScript, React, Node and even Web3 development',
      'Build fully-fledged websites and web apps for your startup or business',
      'Master frontend development with React',
      'Master backend development with Node',
      'Learn professional developer best practices',
      'Build a portfolio of projects to apply for junior developer jobs',
      'Understand how to use databases like PostgreSQL and MongoDB',
    ],

    requirements: [
      'No programming experience needed - I\'ll teach you everything you need to know',
      'A Mac or PC computer with access to the internet',
      'No paid software required - all tools used are free',
      'I\'ll walk you through, step-by-step how to get setup',
    ],

    targetAudience: [
      'Anyone who wants to learn web development from scratch',
      'Students who want to build real-world projects',
      'Anyone looking to start a career as a web developer',
      'Entrepreneurs who want to build their own websites',
    ],

    curriculum: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        lessons: 8,
        duration: '1h 23m',
        lectures: [
          { id: 1, title: 'Welcome to the Course', duration: '5:23', preview: true },
          { id: 2, title: 'How the Web Works', duration: '12:45', preview: true },
          { id: 3, title: 'Setting Up Your Development Environment', duration: '15:32', preview: false },
          { id: 4, title: 'Your First HTML Page', duration: '10:15', preview: false },
          { id: 5, title: 'Understanding HTML Structure', duration: '18:42', preview: false },
          { id: 6, title: 'HTML Forms and Input', duration: '14:28', preview: false },
          { id: 7, title: 'HTML5 Semantic Elements', duration: '11:35', preview: false },
          { id: 8, title: 'Section Project', duration: '25:00', preview: false },
        ],
      },
      {
        id: 2,
        title: 'CSS - Styling Your Websites',
        lessons: 12,
        duration: '2h 45m',
        lectures: [
          { id: 9, title: 'Introduction to CSS', duration: '8:23', preview: true },
          { id: 10, title: 'CSS Selectors', duration: '15:45', preview: false },
          { id: 11, title: 'Colors and Backgrounds', duration: '12:32', preview: false },
          { id: 12, title: 'Box Model', duration: '18:15', preview: false },
          { id: 13, title: 'Flexbox Layout', duration: '22:42', preview: false },
          { id: 14, title: 'CSS Grid', duration: '24:28', preview: false },
          { id: 15, title: 'Responsive Design', duration: '19:35', preview: false },
          { id: 16, title: 'CSS Animations', duration: '16:00', preview: false },
          { id: 17, title: 'CSS Variables', duration: '11:23', preview: false },
          { id: 18, title: 'Modern CSS Techniques', duration: '14:45', preview: false },
          { id: 19, title: 'CSS Best Practices', duration: '13:17', preview: false },
          { id: 20, title: 'Portfolio Project', duration: '35:00', preview: false },
        ],
      },
      {
        id: 3,
        title: 'JavaScript Fundamentals',
        lessons: 15,
        duration: '3h 52m',
        lectures: [
          { id: 21, title: 'Introduction to JavaScript', duration: '10:23', preview: true },
          { id: 22, title: 'Variables and Data Types', duration: '18:45', preview: false },
          { id: 23, title: 'Operators and Expressions', duration: '15:32', preview: false },
          // More lectures...
        ],
      },
      {
        id: 4,
        title: 'Advanced JavaScript',
        lessons: 18,
        duration: '4h 18m',
        lectures: [],
      },
      {
        id: 5,
        title: 'React - Building Modern UIs',
        lessons: 22,
        duration: '5h 45m',
        lectures: [],
      },
      {
        id: 6,
        title: 'Node.js and Express',
        lessons: 16,
        duration: '4h 12m',
        lectures: [],
      },
      {
        id: 7,
        title: 'Databases - PostgreSQL & MongoDB',
        lessons: 14,
        duration: '3h 28m',
        lectures: [],
      },
      {
        id: 8,
        title: 'Final Project - Build a Full-Stack App',
        lessons: 10,
        duration: '6h 30m',
        lectures: [],
      },
    ],

    reviews: [
      {
        id: 1,
        user: {
          name: 'Emily Chen',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        rating: 5,
        date: '2 weeks ago',
        helpful: 234,
        comment: 'This is hands down the best web development course I\'ve taken! The instructor explains everything clearly and the projects are really practical. I went from knowing nothing to building full-stack applications. Highly recommended!',
      },
      {
        id: 2,
        user: {
          name: 'David Martinez',
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
        rating: 5,
        date: '3 weeks ago',
        helpful: 189,
        comment: 'Excellent course structure. Each section builds upon the previous one logically. The instructor is very engaging and the projects help solidify the concepts. Worth every penny!',
      },
      {
        id: 3,
        user: {
          name: 'Sarah Thompson',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        rating: 4,
        date: '1 month ago',
        helpful: 145,
        comment: 'Great course overall! Very comprehensive and well-paced. The only reason I\'m not giving 5 stars is that I wish there were more advanced topics covered. But for beginners to intermediate, this is perfect.',
      },
      {
        id: 4,
        user: {
          name: 'Michael Johnson',
          avatar: 'https://i.pravatar.cc/150?img=8',
        },
        rating: 5,
        date: '1 month ago',
        helpful: 198,
        comment: 'I landed my first developer job after completing this course! The practical projects were exactly what I needed for my portfolio. Thank you!',
      },
    ],
  };

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="container-custom py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {course.bestseller && (
                <Badge variant="warning" className="mb-4">
                  Bestseller
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.subtitle}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Rating value={course.rating} count={course.reviews} />
                <span className="text-gray-300">•</span>
                <span className="text-gray-300">{course.students.toLocaleString()} students</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Avatar src={course.instructor.avatar} alt={course.instructor.name} size="md" />
                <div>
                  <p className="font-medium">Created by {course.instructor.name}</p>
                  <p className="text-sm text-gray-400">{course.instructor.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated {course.lastUpdated}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  {course.language}
                </span>
              </div>
            </div>

            {/* Sticky Course Card - Desktop */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* Sticky Course Card - Desktop */}
      <div className="hidden lg:block">
        <div className="fixed top-24 right-8 w-80 z-30">
          <Card className="shadow-hard">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <Card.Body className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">${course.price}</span>
                  <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
                  <Badge variant="danger">43% OFF</Badge>
                </div>
                <p className="text-sm text-danger-600 font-medium">2 days left at this price!</p>
              </div>

              <div className="space-y-2">
                <Button variant="primary" fullWidth size="lg">
                  Enroll Now
                </Button>
                <Button variant="outline" fullWidth>
                  Add to Cart
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                30-Day Money-Back Guarantee
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3 text-sm">
                <h4 className="font-semibold text-gray-900">This course includes:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration} on-demand video
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    16 coding exercises
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Access on mobile and TV
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Full lifetime access
                  </div>
                </div>
              </div>

              <button className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                <span className="flex items-center justify-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Add to Wishlist
                </span>
              </button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="lg:mr-96">
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex gap-8 overflow-x-auto">
              {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* What You'll Learn */}
              <Card>
                <Card.Body>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <svg className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Description */}
              <Card>
                <Card.Body>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <div className="text-gray-700 whitespace-pre-line">{course.description}</div>
                </Card.Body>
              </Card>

              {/* Requirements */}
              <Card>
                <Card.Body>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex gap-3 text-gray-700">
                        <span className="text-gray-400">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              {/* Target Audience */}
              <Card>
                <Card.Body>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Who this course is for</h2>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex gap-3 text-gray-700">
                        <span className="text-gray-400">•</span>
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <Card>
              <Card.Body>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                  <span className="text-sm text-gray-600">
                    {course.curriculum.reduce((acc, section) => acc + section.lessons, 0)} lectures • {course.duration}
                  </span>
                </div>

                <div className="space-y-2">
                  {course.curriculum.map((section) => (
                    <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-5 h-5 text-gray-600 transition-transform ${
                              expandedSections[section.id] ? 'rotate-90' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-semibold text-gray-900">{section.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {section.lessons} lectures • {section.duration}
                        </span>
                      </button>

                      {expandedSections[section.id] && section.lectures.length > 0 && (
                        <div className="border-t border-gray-200">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-700">{lecture.title}</span>
                                {lecture.preview && (
                                  <Badge variant="primary" size="sm">Preview</Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">{lecture.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Instructor Tab */}
          {activeTab === 'instructor' && (
            <Card>
              <Card.Body>
                <div className="flex items-start gap-6 mb-6">
                  <Avatar src={course.instructor.avatar} alt={course.instructor.name} size="xl" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {course.instructor.name}
                    </h2>
                    <p className="text-gray-600 mb-4">{course.instructor.title}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-1 text-warning-400 mb-1">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          <span className="font-semibold text-gray-900">{course.instructor.rating}</span>
                        </div>
                        <p className="text-sm text-gray-600">Instructor Rating</p>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {course.instructor.reviews.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Reviews</p>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {course.instructor.students.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Students</p>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 mb-1">
                          {course.instructor.courses}
                        </div>
                        <p className="text-sm text-gray-600">Courses</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{course.instructor.bio}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Overview */}
              <Card>
                <Card.Body>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {course.rating}
                      </div>
                      <Rating value={course.rating} size="lg" showValue={false} />
                      <p className="text-sm text-gray-600 mt-2">Course Rating</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <div className="w-16 text-sm text-gray-600">{stars} stars</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-warning-400"
                              style={{
                                width: `${
                                  stars === 5 ? 75 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 3 : 2
                                }%`,
                              }}
                            ></div>
                          </div>
                          <div className="w-12 text-sm text-gray-600 text-right">
                            {stars === 5 ? 75 : stars === 4 ? 15 : stars === 3 ? 5 : stars === 2 ? 3 : 2}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {course.reviews.map((review) => (
                  <Card key={review.id}>
                    <Card.Body>
                      <div className="flex items-start gap-4">
                        <Avatar src={review.user.avatar} alt={review.user.name} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <Rating value={review.rating} size="sm" showValue={false} className="mb-3" />
                          <p className="text-gray-700 mb-4">{review.comment}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              Helpful ({review.helpful})
                            </button>
                            <button className="text-gray-600 hover:text-primary-600">Report</button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${course.price}</span>
              <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
            </div>
            <p className="text-xs text-danger-600">2 days left at this price!</p>
          </div>
          <Button variant="primary">
            Enroll Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
