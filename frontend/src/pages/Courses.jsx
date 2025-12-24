import React, { useState } from 'react';
import { Filter, ChevronDown, Search } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const navigate = useNavigate();
  // Mock Data
  const allCourses = [
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
    },
    {
        _id: '5',
        title: 'The Photography Masterclass: Your Complete Guide to Photography',
        instructorName: 'Phil Ebiner',
        rating: 4.7,
        ratingCount: 15000,
        price: 450,
        category: 'Photography',
        bestseller: false,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
        _id: '6',
        title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
        instructorName: 'Maximilian Schwarzmüller',
        rating: 4.8,
        ratingCount: 40000,
        price: 599,
        category: 'Development',
        bestseller: true,
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Development', 'Design', 'Marketing', 'Photography', 'Business'];

  const filteredCourses = selectedCategory === 'All' 
    ? allCourses 
    : allCourses.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-grow md:flex-grow-0">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <input 
                        type="text" 
                        placeholder="Search courses..." 
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary w-full"
                     />
                </div>
                <div className="relative">
                     <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                     </button>
                </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
                <div>
                    <h3 className="font-bold text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center">
                                <input 
                                    type="radio" 
                                    id={cat} 
                                    name="category" 
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor={cat} className="ml-3 text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                                    {cat}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div>
                    <h3 className="font-bold text-gray-900 mb-3">Ratings</h3>
                    <div className="space-y-2">
                         {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                             <div key={rating} className="flex items-center">
                                <input type="radio" name="rating" className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                <label className="ml-3 text-sm text-gray-600 flex items-center gap-1 cursor-pointer">
                                    <span className="font-medium">{rating} & up</span>
                                </label>
                             </div>
                         ))}
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard 
                            key={course._id} 
                            course={course} 
                            onClick={() => navigate(`/courses/${course._id}`)} 
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Courses;
