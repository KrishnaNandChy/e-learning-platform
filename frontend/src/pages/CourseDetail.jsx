import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Monitor
} from 'lucide-react';
import { getCourseById } from '../services/course.service';
import { useAuth } from '../context/AuthContext';
import { Button, Badge, Rating, Avatar, Card, ProgressBar } from '../components/ui';
import './CourseDetail.css';

// Mock course data for demonstration
const mockCourse = {
  id: 1,
  title: 'Complete Web Development Bootcamp 2024',
  subtitle: 'Become a full-stack web developer with just one course. HTML, CSS, JavaScript, Node.js, React, MongoDB, and more!',
  description: `This course is the most comprehensive web development course available online. It covers all the technologies you need to know to become a professional web developer.

Whether you're a complete beginner who has never written a line of code, or you're already a developer looking to expand your skillset, this course is for you.

By the end of this course, you'll be able to:
• Build any website you can imagine
• Create a portfolio of websites and applications
• Work as a freelance web developer
• Apply for junior developer roles

The course covers front-end development (HTML, CSS, JavaScript, React), back-end development (Node.js, Express, MongoDB), deployment, and professional development practices.`,
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  previewVideo: 'https://example.com/preview.mp4',
  instructor: {
    id: 1,
    name: 'Dr. Angela Yu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    title: 'Lead Instructor',
    bio: 'Dr. Angela Yu is the lead instructor at the London App Brewery, London\'s leading Programming Bootcamp. She has taught hundreds of thousands of students how to code and is passionate about making programming accessible.',
    rating: 4.8,
    students: 2500000,
    courses: 12,
  },
  price: 499,
  originalPrice: 3999,
  rating: 4.8,
  reviewCount: 245678,
  studentsEnrolled: 750000,
  lastUpdated: 'December 2024',
  language: 'English',
  level: 'All Levels',
  duration: '65h 30m',
  lectures: 478,
  category: 'Web Development',
  isBestseller: true,
  requirements: [
    'No programming experience needed - I\'ll teach you everything you need to know',
    'A computer with access to the internet',
    'No paid software required',
    'I\'ll walk you through, step-by-step how to get all the software installed and set up',
  ],
  whatYouWillLearn: [
    'Build 16 web development projects for your portfolio',
    'Learn the latest technologies including JavaScript, React, Node.js, and Web3',
    'Master backend development with Node.js and Express',
    'Build fully-fledged websites and web apps',
    'Work as a freelance web developer',
    'Master frontend development with React',
    'Learn professional developer best practices',
    'Understand databases and how to use MongoDB',
  ],
  curriculum: [
    {
      title: 'Introduction to Web Development',
      duration: '2h 30m',
      lectures: 12,
      expanded: true,
      lessons: [
        { title: 'Welcome to the Course!', duration: '5:30', preview: true },
        { title: 'How to Get the Most Out of This Course', duration: '8:15', preview: true },
        { title: 'What You Will Build', duration: '12:00', preview: false },
        { title: 'How Websites Work', duration: '15:45', preview: false },
        { title: 'Setting Up Your Development Environment', duration: '20:00', preview: false },
      ],
    },
    {
      title: 'HTML Fundamentals',
      duration: '4h 15m',
      lectures: 22,
      expanded: false,
      lessons: [
        { title: 'Introduction to HTML', duration: '10:30', preview: false },
        { title: 'HTML Document Structure', duration: '15:00', preview: false },
        { title: 'HTML Elements and Tags', duration: '18:45', preview: false },
        { title: 'Working with Links', duration: '12:00', preview: false },
      ],
    },
    {
      title: 'CSS Styling',
      duration: '6h 45m',
      lectures: 35,
      expanded: false,
      lessons: [
        { title: 'Introduction to CSS', duration: '12:00', preview: false },
        { title: 'CSS Selectors', duration: '20:00', preview: false },
        { title: 'The Box Model', duration: '25:00', preview: false },
      ],
    },
    {
      title: 'JavaScript Basics',
      duration: '8h 20m',
      lectures: 45,
      expanded: false,
      lessons: [],
    },
    {
      title: 'React.js Framework',
      duration: '12h',
      lectures: 65,
      expanded: false,
      lessons: [],
    },
  ],
  reviews: [
    {
      id: 1,
      user: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      rating: 5,
      date: '2 weeks ago',
      content: 'This is by far the best web development course I\'ve ever taken. Angela explains everything so clearly and the projects are super practical. I landed a job as a junior developer after completing this course!',
      helpful: 234,
    },
    {
      id: 2,
      user: { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      rating: 5,
      date: '1 month ago',
      content: 'Excellent course for beginners. The pace is perfect and the explanations are thorough. I especially loved the React section.',
      helpful: 156,
    },
    {
      id: 3,
      user: { name: 'Emily Davis', avatar: '' },
      rating: 4,
      date: '1 month ago',
      content: 'Great course overall! Some sections could be updated but the fundamentals are solid. Would recommend to anyone starting out.',
      helpful: 89,
    },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({ 0: true });
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(id);
        setCourse(res.data || mockCourse);
      } catch (error) {
        console.error('Failed to fetch course, using mock data');
        setCourse(mockCourse);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="spinner-lg"></div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-error">
        <h2>Course not found</h2>
        <p>The course you&apos;re looking for doesn&apos;t exist.</p>
        <Link to="/courses">
          <Button variant="primary">Browse Courses</Button>
        </Link>
      </div>
    );
  }

  const discount = course.originalPrice 
    ? Math.round((1 - course.price / course.originalPrice) * 100) 
    : 0;

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
            <p className="course-subtitle">{course.subtitle}</p>

            {/* Badges */}
            <div className="course-badges">
              {course.isBestseller && <Badge variant="warning">Bestseller</Badge>}
              <Badge variant="primary">{course.level}</Badge>
            </div>

            {/* Meta */}
            <div className="course-meta">
              <div className="course-rating">
                <Rating value={course.rating} size="md" showValue showCount count={course.reviewCount} />
              </div>
              <span className="course-meta-item">
                <Users size={16} />
                {course.studentsEnrolled?.toLocaleString()} students
              </span>
            </div>

            {/* Instructor */}
            <div className="course-instructor-mini">
              <span>Created by</span>
              <Link to={`/instructors/${course.instructor.id}`}>
                {course.instructor.name}
              </Link>
            </div>

            {/* Info Row */}
            <div className="course-info-row">
              <span><Clock size={14} /> Last updated {course.lastUpdated}</span>
              <span><Globe size={14} /> {course.language}</span>
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
              <Card className="course-section" padding="lg">
                <h2 className="course-section-title">What you&apos;ll learn</h2>
                <ul className="course-learn-list">
                  {course.whatYouWillLearn?.map((item, index) => (
                    <li key={index}>
                      <CheckCircle size={18} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Course Content / Curriculum */}
              <div className="course-section">
                <div className="course-section-header">
                  <h2 className="course-section-title">Course content</h2>
                  <p className="course-content-summary">
                    {course.curriculum?.length} sections • {course.lectures} lectures • {course.duration} total length
                  </p>
                </div>
                <div className="course-curriculum">
                  {course.curriculum?.map((section, index) => (
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
                          {section.lectures} lectures • {section.duration}
                        </span>
                      </button>
                      {expandedSections[index] && section.lessons?.length > 0 && (
                        <ul className="curriculum-lessons">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="curriculum-lesson">
                              <div className="curriculum-lesson-info">
                                {lesson.preview ? (
                                  <PlayCircle size={16} className="lesson-icon preview" />
                                ) : (
                                  <Lock size={16} className="lesson-icon" />
                                )}
                                <span className="curriculum-lesson-title">{lesson.title}</span>
                                {lesson.preview && <Badge size="sm" variant="primary">Preview</Badge>}
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
              <div className="course-section">
                <h2 className="course-section-title">Requirements</h2>
                <ul className="course-requirements">
                  {course.requirements?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

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
                      <Link to={`/instructors/${course.instructor.id}`} className="instructor-name">
                        {course.instructor.name}
                      </Link>
                      <p className="instructor-title">{course.instructor.title}</p>
                      <div className="instructor-stats">
                        <span><Rating value={course.instructor.rating} size="sm" showValue /> Instructor Rating</span>
                        <span><Award size={14} /> {course.instructor.courses} Courses</span>
                        <span><Users size={14} /> {(course.instructor.students / 1000000).toFixed(1)}M Students</span>
                      </div>
                    </div>
                  </div>
                  <p className="instructor-bio">{course.instructor.bio}</p>
                </Card>
              </div>

              {/* Reviews */}
              <div className="course-section">
                <h2 className="course-section-title">Student Reviews</h2>
                <div className="reviews-summary">
                  <div className="reviews-score">
                    <span className="reviews-score-value">{course.rating}</span>
                    <Rating value={course.rating} size="lg" />
                    <span className="reviews-score-label">Course Rating</span>
                  </div>
                  <div className="reviews-breakdown">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="reviews-bar">
                        <ProgressBar value={stars === 5 ? 78 : stars === 4 ? 15 : stars === 3 ? 5 : 2} showLabel={false} size="sm" />
                        <Rating value={stars} size="xs" />
                        <span>{stars === 5 ? '78%' : stars === 4 ? '15%' : stars === 3 ? '5%' : '2%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="reviews-list">
                  {course.reviews?.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <Avatar src={review.user.avatar} name={review.user.name} size="md" />
                        <div className="review-meta">
                          <p className="review-author">{review.user.name}</p>
                          <div className="review-rating">
                            <Rating value={review.rating} size="sm" />
                            <span>{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="review-content">{review.content}</p>
                      <div className="review-actions">
                        <button className="review-helpful">
                          Was this review helpful? ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" fullWidth>
                  See All Reviews
                </Button>
              </div>
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
                    {course.originalPrice && (
                      <span className="course-price-original">
                        ₹{course.originalPrice?.toLocaleString()}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="course-price-discount">{discount}% off</span>
                    )}
                  </div>
                  <p className="course-price-timer">
                    <Clock size={14} /> 2 days left at this price!
                  </p>
                </div>

                {/* Actions */}
                <div className="course-actions">
                  <Button variant="primary" size="lg" fullWidth>
                    {user ? 'Enroll Now' : 'Buy Now'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    fullWidth
                    leftIcon={<Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                </div>

                <p className="course-guarantee">30-Day Money-Back Guarantee</p>

                {/* Includes */}
                <div className="course-includes">
                  <h4>This course includes:</h4>
                  <ul>
                    <li><PlayCircle size={16} /> {course.duration} on-demand video</li>
                    <li><FileText size={16} /> 15 articles</li>
                    <li><Download size={16} /> 25 downloadable resources</li>
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
