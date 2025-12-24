import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { getAllCourses } from '../services/course.service';
import CourseCard from '../components/CourseCard';
import { Button, Select, Badge, Spinner } from '../components/ui';
import './Courses.css';

// Mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    instructor: { name: 'Dr. Angela Yu' },
    price: 499,
    originalPrice: 3999,
    rating: 4.8,
    reviewCount: 245000,
    studentsEnrolled: 750000,
    duration: '65h 30m',
    level: 'All Levels',
    category: 'Web Development',
    isBestseller: true,
  },
  {
    id: 2,
    title: 'Machine Learning A-Z: AI, Python & R',
    description: 'Master Machine Learning on Python & R.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
    instructor: { name: 'Kirill Eremenko' },
    price: 649,
    originalPrice: 4999,
    rating: 4.6,
    reviewCount: 180000,
    studentsEnrolled: 890000,
    duration: '44h 15m',
    level: 'Intermediate',
    category: 'Data Science',
    isBestseller: true,
  },
  {
    id: 3,
    title: 'The Complete Digital Marketing Course',
    description: 'Master Digital Marketing Strategy, Social Media.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    instructor: { name: 'Rob Percival' },
    price: 399,
    originalPrice: 2999,
    rating: 4.5,
    reviewCount: 95000,
    studentsEnrolled: 320000,
    duration: '23h 45m',
    level: 'Beginner',
    category: 'Marketing',
    isNew: true,
  },
  {
    id: 4,
    title: 'UI/UX Design Masterclass',
    description: 'Learn UI/UX design from scratch.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    instructor: { name: 'Daniel Scott' },
    price: 549,
    originalPrice: 3499,
    rating: 4.7,
    reviewCount: 42000,
    studentsEnrolled: 150000,
    duration: '32h 20m',
    level: 'Beginner',
    category: 'Design',
  },
  {
    id: 5,
    title: 'React - The Complete Guide 2024',
    description: 'Dive in and learn React.js from scratch!',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    instructor: { name: 'Maximilian Schwarzmüller' },
    price: 599,
    originalPrice: 3999,
    rating: 4.7,
    reviewCount: 195000,
    studentsEnrolled: 680000,
    duration: '48h',
    level: 'All Levels',
    category: 'Web Development',
    isBestseller: true,
  },
  {
    id: 6,
    title: 'Python for Data Science and Machine Learning',
    description: 'Learn how to use Python for Data Science.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600',
    instructor: { name: 'Jose Portilla' },
    price: 499,
    originalPrice: 2999,
    rating: 4.6,
    reviewCount: 135000,
    studentsEnrolled: 520000,
    duration: '25h',
    level: 'Intermediate',
    category: 'Data Science',
  },
  {
    id: 7,
    title: 'iOS & Swift - The Complete Development',
    description: 'From beginner to iOS App Developer.',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600',
    instructor: { name: 'Dr. Angela Yu' },
    price: 649,
    originalPrice: 4499,
    rating: 4.8,
    reviewCount: 78000,
    studentsEnrolled: 280000,
    duration: '55h',
    level: 'Beginner',
    category: 'Mobile Development',
  },
  {
    id: 8,
    title: 'Photography Masterclass: Complete Guide',
    description: 'The complete guide to photography.',
    thumbnail: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
    instructor: { name: 'Phil Ebiner' },
    price: 349,
    originalPrice: 1999,
    rating: 4.5,
    reviewCount: 52000,
    studentsEnrolled: 195000,
    duration: '18h',
    level: 'All Levels',
    category: 'Photography',
    isNew: true,
  },
];

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Mobile Development',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
];

const levels = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const priceRanges = [
  { value: '', label: 'All Prices' },
  { value: 'free', label: 'Free' },
  { value: '0-500', label: 'Under ₹500' },
  { value: '500-1000', label: '₹500 - ₹1000' },
  { value: '1000+', label: 'Above ₹1000' },
];

const ratings = [
  { value: '', label: 'All Ratings' },
  { value: '4.5', label: '4.5 & up' },
  { value: '4.0', label: '4.0 & up' },
  { value: '3.5', label: '3.5 & up' },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rated', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') || '');
  const [selectedPrice, setSelectedPrice] = useState(searchParams.get('price') || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getAllCourses();
        if (res.data && res.data.length > 0) {
          setCourses(res.data);
        } else {
          setCourses(mockCourses);
        }
      } catch (error) {
        console.error('Failed to fetch courses, using mock data');
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort courses
  const filteredCourses = courses.filter((course) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        course.title.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories') {
      if (course.category !== selectedCategory) return false;
    }

    // Level filter
    if (selectedLevel) {
      if (course.level?.toLowerCase() !== selectedLevel) return false;
    }

    // Rating filter
    if (selectedRating) {
      if (course.rating < parseFloat(selectedRating)) return false;
    }

    // Price filter
    if (selectedPrice) {
      if (selectedPrice === 'free' && course.price !== 0) return false;
      if (selectedPrice === '0-500' && (course.price < 0 || course.price > 500)) return false;
      if (selectedPrice === '500-1000' && (course.price < 500 || course.price > 1000)) return false;
      if (selectedPrice === '1000+' && course.price < 1000) return false;
    }

    return true;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'rated':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
      default:
        return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
    }
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLevel('');
    setSelectedPrice('');
    setSelectedRating('');
    setSortBy('popular');
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory && selectedCategory !== 'All Categories',
    selectedLevel,
    selectedPrice,
    selectedRating,
  ].filter(Boolean).length;

  return (
    <div className="courses-page">
      {/* Header */}
      <div className="courses-header">
        <div className="container">
          <h1>Browse Courses</h1>
          <p>Discover from over 50,000 online courses taught by expert instructors</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="courses-toolbar">
        <div className="container">
          <div className="courses-toolbar-content">
            {/* Search */}
            <div className="courses-search">
              <Search size={20} className="courses-search-icon" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="courses-search-input"
              />
              {searchQuery && (
                <button 
                  className="courses-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Desktop Filters */}
            <div className="courses-filters-desktop">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map(c => ({ value: c, label: c }))}
                placeholder="Category"
                size="sm"
                className="courses-filter-select"
              />
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                options={levels}
                placeholder="Level"
                size="sm"
                className="courses-filter-select"
              />
              <Select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                options={priceRanges}
                placeholder="Price"
                size="sm"
                className="courses-filter-select"
              />
              <Select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                options={ratings}
                placeholder="Rating"
                size="sm"
                className="courses-filter-select"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <Button 
              variant="outline" 
              size="sm"
              className="courses-filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal size={18} />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm" rounded>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Sort and View */}
            <div className="courses-toolbar-right">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                size="sm"
                className="courses-sort-select"
              />
              <div className="courses-view-toggle">
                <button
                  className={`courses-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`courses-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="courses-active-filters">
              {selectedCategory && selectedCategory !== 'All Categories' && (
                <Badge variant="primary" className="courses-filter-badge">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}><X size={14} /></button>
                </Badge>
              )}
              {selectedLevel && (
                <Badge variant="primary" className="courses-filter-badge">
                  {levels.find(l => l.value === selectedLevel)?.label}
                  <button onClick={() => setSelectedLevel('')}><X size={14} /></button>
                </Badge>
              )}
              {selectedPrice && (
                <Badge variant="primary" className="courses-filter-badge">
                  {priceRanges.find(p => p.value === selectedPrice)?.label}
                  <button onClick={() => setSelectedPrice('')}><X size={14} /></button>
                </Badge>
              )}
              {selectedRating && (
                <Badge variant="primary" className="courses-filter-badge">
                  {ratings.find(r => r.value === selectedRating)?.label}
                  <button onClick={() => setSelectedRating('')}><X size={14} /></button>
                </Badge>
              )}
              <button className="courses-clear-filters" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="courses-filters-mobile">
          <div className="container">
            <div className="courses-filters-mobile-grid">
              <Select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map(c => ({ value: c, label: c }))}
                size="sm"
              />
              <Select
                label="Level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                options={levels}
                size="sm"
              />
              <Select
                label="Price Range"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                options={priceRanges}
                size="sm"
              />
              <Select
                label="Rating"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                options={ratings}
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="courses-content">
        <div className="container">
          {/* Results Count */}
          <div className="courses-results-info">
            <p>
              Showing <strong>{sortedCourses.length}</strong> 
              {sortedCourses.length === 1 ? ' course' : ' courses'}
              {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="courses-loading">
              <Spinner size="lg" />
              <p>Loading courses...</p>
            </div>
          ) : sortedCourses.length === 0 ? (
            <div className="courses-empty">
              <div className="courses-empty-icon">
                <Search size={48} />
              </div>
              <h3>No courses found</h3>
              <p>Try adjusting your search or filters to find what you&apos;re looking for.</p>
              <Button variant="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={`courses-grid ${viewMode === 'list' ? 'courses-list' : ''}`}>
              {sortedCourses.map((course) => (
                <CourseCard 
                  key={course.id || course._id} 
                  course={course}
                  variant={viewMode === 'list' ? 'list' : 'default'}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && sortedCourses.length > 0 && (
            <div className="courses-load-more">
              <Button variant="outline" size="lg">
                Load More Courses
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
