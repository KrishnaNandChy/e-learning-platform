import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Play, Users, Award } from 'lucide-react';
import CourseCard from '../components/CourseCard';

const Home = () => {
  const navigate = useNavigate();

  // Mock Data
  const categories = [
    "Design", "Development", "Marketing", "IT & Software", "Personal Development", "Business", "Photography", "Music"
  ];

  const featuredCourses = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp 2025',
      instructorName: 'Angela Yu',
      rating: 4.8,
      ratingCount: 12500,
      price: 499,
      category: 'Development',
      bestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '2',
      title: 'UI/UX Design Masterclass: From Beginner to Pro',
      instructorName: 'Gary Simon',
      rating: 4.9,
      ratingCount: 8500,
      price: 699,
      category: 'Design',
      bestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '3',
      title: 'Digital Marketing Strategy Bundle',
      instructorName: 'Seth Godin',
      rating: 4.7,
      ratingCount: 5000,
      price: 399,
      category: 'Marketing',
      bestseller: false,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      _id: '4',
      title: 'Python for Data Science and Machine Learning',
      instructorName: 'Jose Portilla',
      rating: 4.8,
      ratingCount: 22000,
      price: 599,
      category: 'Development',
      bestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Unlock your potential</span>{' '}
                  <span className="block text-primary xl:inline">with online learning</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Learn from industry experts, gain new skills, and advance your career. Join millions of learners worldwide on EduPlatform.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button onClick={() => navigate('/signup')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-indigo-700 md:py-4 md:text-lg">
                      Get started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button onClick={() => navigate('/courses')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg">
                      Explore courses
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1651&q=80"
            alt="Students learning"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Play className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">10k+</h3>
                    <p className="text-gray-600">Online Courses</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">500k+</h3>
                    <p className="text-gray-600">Active Learners</p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">Expert</h3>
                    <p className="text-gray-600">Certified Instructors</p>
                </div>
            </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
           <div>
             <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
             <p className="mt-2 text-gray-600">Hand-picked courses for you to start learning today.</p>
           </div>
           <button onClick={() => navigate('/courses')} className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:text-indigo-700">
             View all <ArrowRight className="w-4 h-4" />
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              onClick={() => navigate(`/courses/${course._id}`)} 
            />
          ))}
        </div>
        <div className="mt-8 sm:hidden text-center">
            <button onClick={() => navigate('/courses')} className="text-primary font-semibold">View all courses</button>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Top Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex flex-col items-center justify-center text-center group">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{cat}</h3>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Instructor CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Become an Instructor</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Instructors from around the world teach millions of students on EduPlatform. We provide the tools and skills to teach what you love.
                    </p>
                    <div>
                        <button onClick={() => navigate('/instructor/dashboard')} className="px-8 py-3 bg-secondary text-white font-medium rounded-md hover:bg-black transition-colors">
                            Start Teaching Today
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 bg-gray-100">
                    <img 
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                        alt="Instructor teaching" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
