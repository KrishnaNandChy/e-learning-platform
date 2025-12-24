import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { getAllCourses } from '../services/course.service';
import CourseCard from '../components/CourseCard';
import { Button, Select, Badge, Spinner } from '../components/ui';
import './Courses.css';

const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Machine Learning',
  'Mobile Development',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
  'DevOps',
  'Health & Fitness',
  'Personal Development',
];

const levels = [
  { value: '', label: 'All Levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'All Levels', label: 'All Levels' },
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
        const params = {
          search: searchQuery || undefined,
          category: selectedCategory && selectedCategory !== 'All Categories' ? selectedCategory : undefined,
          level: selectedLevel || undefined,
          price: selectedPrice || undefined,
          rating: selectedRating || undefined,
          sort: sortBy || 'popular',
        };
        
        // Remove undefined values
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
        
        const res = await getAllCourses(params);
        if (res.data?.success && res.data?.data?.length > 0) {
          setCourses(res.data.data);
        } else if (res.data?.data) {
          setCourses(res.data.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchQuery, selectedCategory, selectedLevel, selectedPrice, selectedRating, sortBy]);

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
          <p>Discover from thousands of online courses taught by expert instructors</p>
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
              Showing <strong>{courses.length}</strong> 
              {courses.length === 1 ? ' course' : ' courses'}
              {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="courses-loading">
              <Spinner size="lg" />
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
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
              {courses.map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={course}
                  variant={viewMode === 'list' ? 'list' : 'default'}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && courses.length > 0 && (
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
