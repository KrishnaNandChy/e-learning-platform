import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card, Badge, Rating } from '../components/ui';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: '',
    price: '',
    rating: '',
    duration: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Mock courses data
  const allCourses = [
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
      updated: 'December 2024',
      description: 'Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.',
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
      updated: 'November 2024',
      description: 'Master Machine Learning with Python, build AI models, and understand complex algorithms.',
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
      updated: 'December 2024',
      description: 'Learn UI/UX design principles, tools like Figma, and create stunning user experiences.',
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
      updated: 'October 2024',
      description: 'Complete guide to digital marketing: SEO, social media, email marketing, and analytics.',
    },
    {
      id: 5,
      title: 'Python for Data Science',
      instructor: 'Robert Brown',
      rating: 4.8,
      reviews: 18230,
      students: 98500,
      price: 89.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
      category: 'Data Science',
      level: 'Beginner',
      duration: '32 hours',
      bestseller: true,
      updated: 'December 2024',
      description: 'Learn Python programming for data analysis, visualization, and machine learning.',
    },
    {
      id: 6,
      title: 'AWS Certified Solutions Architect',
      instructor: 'David Lee',
      rating: 4.7,
      reviews: 9870,
      students: 54300,
      price: 99.99,
      originalPrice: 189.99,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
      category: 'IT & Software',
      level: 'Intermediate',
      duration: '48 hours',
      bestseller: false,
      updated: 'November 2024',
      description: 'Prepare for AWS certification and master cloud architecture on Amazon Web Services.',
    },
    {
      id: 7,
      title: 'Business Strategy and Leadership',
      instructor: 'Emily Chen',
      rating: 4.5,
      reviews: 6540,
      students: 32100,
      price: 69.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500',
      category: 'Business',
      level: 'All Levels',
      duration: '24 hours',
      bestseller: false,
      updated: 'September 2024',
      description: 'Develop strategic thinking and leadership skills for business success.',
    },
    {
      id: 8,
      title: 'iOS App Development with Swift',
      instructor: 'Alex Turner',
      rating: 4.8,
      reviews: 11230,
      students: 62400,
      price: 94.99,
      originalPrice: 169.99,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
      category: 'Development',
      level: 'Intermediate',
      duration: '40 hours',
      bestseller: true,
      updated: 'December 2024',
      description: 'Build professional iOS apps using Swift and SwiftUI for iPhone and iPad.',
    },
  ];

  const categories = [
    'Development',
    'Business',
    'Design',
    'Marketing',
    'IT & Software',
    'Data Science',
    'Personal Development',
    'Photography',
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { label: 'Free', value: 'free' },
    { label: 'Under $50', value: 'under50' },
    { label: '$50 - $100', value: '50-100' },
    { label: 'Over $100', value: 'over100' },
  ];
  const ratings = [4.5, 4.0, 3.5, 3.0];
  const durations = [
    { label: 'Under 3 hours', value: 'short' },
    { label: '3-6 hours', value: 'medium' },
    { label: 'Over 6 hours', value: 'long' },
  ];

  // Filter courses based on selected filters
  const filteredCourses = allCourses.filter((course) => {
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && course.category !== filters.category) {
      return false;
    }
    if (filters.level && course.level !== filters.level) {
      return false;
    }
    if (filters.rating && course.rating < parseFloat(filters.rating)) {
      return false;
    }
    // Add more filter logic as needed
    return true;
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      price: '',
      rating: '',
      duration: '',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {filters.category ? `${filters.category} Courses` : 'All Courses'}
          </h1>
          <p className="text-gray-600">
            {filteredCourses.length} courses found
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Clear Filters */}
              {(filters.category || filters.level || filters.rating) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  fullWidth
                  className="justify-start"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </Button>
              )}

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Level</h3>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <label key={level} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="level"
                        value={level}
                        checked={filters.level === level}
                        onChange={(e) => handleFilterChange('level', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {ratings.map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.rating === rating.toString()}
                        onChange={(e) => handleFilterChange('rating', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-2 flex items-center gap-1 text-sm">
                        <span className="text-warning-400">★</span>
                        <span className="text-gray-700">{rating} & up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Price</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="price"
                        value={range.value}
                        checked={filters.price === range.value}
                        onChange={(e) => handleFilterChange('price', e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                fullWidth
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </Button>
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <Card hover className="h-full">
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="course-card-image"
                      />
                      {course.bestseller && (
                        <Badge variant="warning" className="absolute top-3 left-3">
                          Bestseller
                        </Badge>
                      )}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <Card.Body className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="primary">{course.level}</Badge>
                      </div>

                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>

                      <p className="text-sm text-gray-600">{course.instructor}</p>

                      <Rating value={course.rating} size="sm" count={course.reviews} />

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {course.duration}
                        </span>
                        <span>•</span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">
                            ${course.price}
                          </span>
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${course.originalPrice}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
