import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card, Badge, Rating, Avatar } from '../components/ui';

const Home = () => {
  // Mock data - replace with API calls
  const featuredCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp 2024',
      instructor: 'John Doe',
      rating: 4.8,
      reviews: 15420,
      students: 89340,
      price: 84.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      category: 'Development',
      level: 'Beginner',
      duration: '52 hours',
      bestseller: true,
    },
    {
      id: 2,
      title: 'Machine Learning A-Z: AI, Python & R',
      instructor: 'Jane Smith',
      rating: 4.9,
      reviews: 23150,
      students: 125000,
      price: 94.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '44 hours',
      bestseller: true,
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Mike Johnson',
      rating: 4.7,
      reviews: 8920,
      students: 45600,
      price: 79.99,
      originalPrice: 139.99,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
      category: 'Design',
      level: 'All Levels',
      duration: '36 hours',
      bestseller: false,
    },
    {
      id: 4,
      title: 'Digital Marketing Mastery 2024',
      instructor: 'Sarah Williams',
      rating: 4.6,
      reviews: 12340,
      students: 67800,
      price: 74.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      category: 'Marketing',
      level: 'Beginner',
      duration: '28 hours',
      bestseller: false,
    },
  ];

  const categories = [
    { name: 'Development', icon: '💻', courses: 12450, color: 'from-blue-500 to-cyan-500' },
    { name: 'Business', icon: '💼', courses: 8920, color: 'from-purple-500 to-pink-500' },
    { name: 'Design', icon: '🎨', courses: 7340, color: 'from-orange-500 to-red-500' },
    { name: 'Marketing', icon: '📊', courses: 6540, color: 'from-green-500 to-teal-500' },
    { name: 'IT & Software', icon: '🔧', courses: 9870, color: 'from-indigo-500 to-purple-500' },
    { name: 'Personal Development', icon: '🌟', courses: 5430, color: 'from-yellow-500 to-orange-500' },
    { name: 'Photography', icon: '📷', courses: 4320, color: 'from-pink-500 to-rose-500' },
    { name: 'Music', icon: '🎵', courses: 3210, color: 'from-cyan-500 to-blue-500' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Emily Chen',
      role: 'Software Developer',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'EduLearn transformed my career! The courses are comprehensive and the instructors are top-notch. I landed my dream job after completing the Web Development Bootcamp.',
    },
    {
      id: 2,
      name: 'David Martinez',
      role: 'Data Analyst',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      text: 'The flexibility and quality of courses on EduLearn are unmatched. I was able to learn at my own pace and apply the knowledge immediately to my work.',
    },
    {
      id: 3,
      name: 'Sarah Thompson',
      role: 'UX Designer',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'Best investment in my professional development. The UI/UX courses helped me transition from graphic design to UX design seamlessly.',
    },
  ];

  const stats = [
    { number: '50M+', label: 'Students' },
    { number: '75K+', label: 'Courses' },
    { number: '50K+', label: 'Expert Instructors' },
    { number: '180+', label: 'Countries' },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Learn at Your Pace',
      description: 'Flexible learning with lifetime access to course materials.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Certificates',
      description: 'Earn recognized certificates upon course completion.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Community Support',
      description: 'Join a global community of learners and instructors.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="container-custom py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Without Limits
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-100">
                Start, switch, or advance your career with thousands of courses from world-class instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                    Explore Courses
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-primary-600">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block animate-slide-up">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
                alt="Students learning" 
                className="rounded-2xl shadow-hard"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Courses
            </h2>
            <Link to="/courses">
              <Button variant="outline">View All Courses</Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card hover className="h-full">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="course-card-image"
                    />
                    {course.bestseller && (
                      <Badge 
                        variant="warning" 
                        className="absolute top-3 left-3"
                      >
                        Bestseller
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="primary">{course.level}</Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600">{course.instructor}</p>
                    
                    <div className="flex items-center justify-between">
                      <Rating value={course.rating} size="sm" count={course.reviews} />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Top Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/courses?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card hover className="text-center">
                  <Card.Body className="space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.courses.toLocaleString()} courses</p>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose EduLearn?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xl text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            What Our Students Say
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white">
                <Card.Body className="space-y-4">
                  <Rating value={testimonial.rating} size="sm" showValue={false} />
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <Avatar src={testimonial.avatar} alt={testimonial.name} size="md" />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join millions of learners and start your journey towards success today.
          </p>
          <Link to="/signup">
            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
