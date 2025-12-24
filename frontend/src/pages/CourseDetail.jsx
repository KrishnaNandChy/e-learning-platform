import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  BarChart, 
  Globe, 
  Award, 
  CheckCircle, 
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Lock,
  FileText,
  Download,
  Infinity,
  Smartphone,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Badge, Rating, Avatar, Card, ProgressBar, Alert } from '../components/ui';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.data.success) {
          setCourse(res.data.data);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        if (err.response?.status === 400) {
          setError('Invalid course ID');
        } else if (err.response?.status === 404) {
          setError('Course not found');
        } else {
          setError('Failed to load course. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      await api.post(`/courses/${id}/enroll`);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      console.error('Enrollment failed:', err);
      setEnrollError(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/courses/${id}/wishlist`);
      setIsWishlisted(res.data.added);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="spinner-lg"></div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-detail-error">
        <h2>{error || 'Course not found'}</h2>
        <p>The course you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
        <Link to="/courses">
          <Button variant="primary">Browse Courses</Button>
        </Link>
      </div>
    );
  }

  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

  // Build curriculum from sections or use default
  const curriculum = course.sections?.length > 0 ? course.sections : [
    {
      title: 'Course Introduction',
      duration: course.duration || '2h',
      lectures: course.totalLessons || 10,
      lessons: [],
    },
  ];

  return (
    <div className="course-detail">
      {/* Hero Section */}
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-content">
            {/* Breadcrumb */}
            <nav className="course-breadcrumb">
              <Link to="/courses">Courses</Link>
              <span>/</span>
              <Link to={`/courses?category=${course.category}`}>{course.category}</Link>
              <span>/</span>
              <span>{course.title}</span>
            </nav>

            {/* Title */}
            <h1 className="course-title">{course.title}</h1>
            <p className="course-subtitle">{course.subtitle || course.description?.slice(0, 150)}</p>

            {/* Badges */}
            <div className="course-badges">
              {course.isBestseller && <Badge variant="warning">Bestseller</Badge>}
              {course.isNewCourse && <Badge variant="success">New</Badge>}
              <Badge variant="primary">{course.level}</Badge>
            </div>

            {/* Meta */}
            <div className="course-meta">
              <div className="course-rating">
                <Rating value={course.rating || 0} size="md" showValue showCount count={course.totalReviews || 0} />
              </div>
              <span className="course-meta-item">
                <Users size={16} />
                {(course.totalStudents || 0).toLocaleString()} students
              </span>
            </div>

            {/* Instructor */}
            <div className="course-instructor-mini">
              <span>Created by</span>
              <Link to={`/instructors/${course.instructor?._id}`}>
                {course.instructor?.name || 'Instructor'}
              </Link>
            </div>

            {/* Info Row */}
            <div className="course-info-row">
              <span><Clock size={14} /> Last updated {course.lastUpdated ? new Date(course.lastUpdated).toLocaleDateString() : 'Recently'}</span>
              <span><Globe size={14} /> {course.language || 'English'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-main">
        <div className="container">
          <div className="course-layout">
            {/* Left Content */}
            <div className="course-content">
              {/* What You'll Learn */}
              {course.whatYouWillLearn?.length > 0 && (
                <Card className="course-section" padding="lg">
                  <h2 className="course-section-title">What you&apos;ll learn</h2>
                  <ul className="course-learn-list">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index}>
                        <CheckCircle size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Course Content / Curriculum */}
              <div className="course-section">
                <div className="course-section-header">
                  <h2 className="course-section-title">Course content</h2>
                  <p className="course-content-summary">
                    {curriculum.length} sections • {course.totalLessons || 0} lectures • {course.duration || '0h'} total length
                  </p>
                </div>
                <div className="course-curriculum">
                  {curriculum.map((section, index) => (
                    <div key={index} className="curriculum-section">
                      <button
                        className="curriculum-section-header"
                        onClick={() => toggleSection(index)}
                        aria-expanded={expandedSections[index]}
                      >
                        <div className="curriculum-section-info">
                          {expandedSections[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          <span className="curriculum-section-title">{section.title}</span>
                        </div>
                        <span className="curriculum-section-meta">
                          {section.lectures || section.lessons?.length || 0} lectures
                        </span>
                      </button>
                      {expandedSections[index] && section.lessons?.length > 0 && (
                        <ul className="curriculum-lessons">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="curriculum-lesson">
                              <div className="curriculum-lesson-info">
                                {lesson.isPreview ? (
                                  <PlayCircle size={16} className="lesson-icon preview" />
                                ) : (
                                  <Lock size={16} className="lesson-icon" />
                                )}
                                <span className="curriculum-lesson-title">{lesson.title}</span>
                                {lesson.isPreview && <Badge size="sm" variant="primary">Preview</Badge>}
                              </div>
                              <span className="curriculum-lesson-duration">{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {course.requirements?.length > 0 && (
                <div className="course-section">
                  <h2 className="course-section-title">Requirements</h2>
                  <ul className="course-requirements">
                    {course.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <div className="course-section">
                <h2 className="course-section-title">Description</h2>
                <div className="course-description">
                  {course.description?.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              {course.instructor && (
                <div className="course-section">
                  <h2 className="course-section-title">Instructor</h2>
                  <Card className="instructor-card-detail" padding="lg">
                    <div className="instructor-header">
                      <Avatar 
                        src={course.instructor.avatar} 
                        name={course.instructor.name}
                        size="xl"
                      />
                      <div className="instructor-info">
                        <Link to={`/instructors/${course.instructor._id}`} className="instructor-name">
                          {course.instructor.name}
                        </Link>
                        <p className="instructor-title">{course.instructor.expertise?.join(', ') || 'Expert Instructor'}</p>
                        <div className="instructor-stats">
                          <span><Rating value={course.instructor.rating || 4.5} size="sm" showValue /> Rating</span>
                          <span><Award size={14} /> {course.instructor.totalCourses || 0} Courses</span>
                          <span><Users size={14} /> {((course.instructor.totalStudents || 0) / 1000).toFixed(0)}K Students</span>
                        </div>
                      </div>
                    </div>
                    {course.instructor.bio && (
                      <p className="instructor-bio">{course.instructor.bio}</p>
                    )}
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="course-sidebar">
              <div className="course-sidebar-card">
                {/* Preview */}
                <div className="course-preview">
                  <img src={course.thumbnail} alt={course.title} />
                  <button className="course-preview-play">
                    <Play size={32} fill="white" />
                  </button>
                  <span className="course-preview-text">Preview this course</span>
                </div>

                {/* Price */}
                <div className="course-price-section">
                  <div className="course-price">
                    <span className="course-price-current">
                      {course.price === 0 ? 'Free' : `₹${course.price?.toLocaleString()}`}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="course-price-original">
                        ₹{course.originalPrice?.toLocaleString()}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="course-price-discount">{discount}% off</span>
                    )}
                  </div>
                  <p className="course-price-timer">
                    <Clock size={14} /> Limited time offer!
                  </p>
                </div>

                {/* Enrollment Error */}
                {enrollError && (
                  <Alert variant="error" dismissible onDismiss={() => setEnrollError(null)}>
                    {enrollError}
                  </Alert>
                )}

                {/* Actions */}
                <div className="course-actions">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    onClick={handleEnroll}
                    loading={enrolling}
                  >
                    {isAuthenticated ? (course.price === 0 ? 'Enroll for Free' : 'Enroll Now') : 'Login to Enroll'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    fullWidth
                    leftIcon={<Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />}
                    onClick={handleWishlist}
                  >
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                </div>

                <p className="course-guarantee">30-Day Money-Back Guarantee</p>

                {/* Includes */}
                <div className="course-includes">
                  <h4>This course includes:</h4>
                  <ul>
                    <li><PlayCircle size={16} /> {course.duration || '0h'} on-demand video</li>
                    <li><FileText size={16} /> Downloadable resources</li>
                    <li><Infinity size={16} /> Full lifetime access</li>
                    <li><Smartphone size={16} /> Access on mobile and TV</li>
                    <li><Award size={16} /> Certificate of completion</li>
                  </ul>
                </div>

                {/* Share */}
                <div className="course-share">
                  <Button variant="ghost" size="sm" leftIcon={<Share2 size={16} />}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
