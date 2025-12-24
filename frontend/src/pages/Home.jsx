import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Play, 
  Users, 
  BookOpen, 
  Award, 
  Globe,
  Code,
  Palette,
  TrendingUp,
  Camera,
  Music,
  Briefcase,
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';
import { Button, Card, Badge, Avatar, Rating } from '../components/ui';
import CourseCard from '../components/CourseCard';
import './Home.css';

// Mock data for demonstration
const featuredCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. Become a full-stack developer.',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
    instructor: { name: 'Dr. Angela Yu', avatar: '' },
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
    description: 'Master Machine Learning on Python & R with hands-on practical exercises.',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
    instructor: { name: 'Kirill Eremenko', avatar: '' },
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
    description: 'Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email & more.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
    instructor: { name: 'Rob Percival', avatar: '' },
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
    title: 'UI/UX Design Masterclass: Create Beautiful Interfaces',
    description: 'Learn UI/UX design from scratch. Master Figma, design systems, and user research.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
    instructor: { name: 'Daniel Scott', avatar: '' },
    price: 549,
    originalPrice: 3499,
    rating: 4.7,
    reviewCount: 42000,
    studentsEnrolled: 150000,
    duration: '32h 20m',
    level: 'Beginner',
    category: 'Design',
  },
];

const categories = [
  { name: 'Development', icon: Code, count: 2500, color: '#6366f1' },
  { name: 'Design', icon: Palette, count: 1200, color: '#ec4899' },
  { name: 'Business', icon: TrendingUp, count: 1800, color: '#10b981' },
  { name: 'Photography', icon: Camera, count: 800, color: '#f59e0b' },
  { name: 'Music', icon: Music, count: 650, color: '#8b5cf6' },
  { name: 'Marketing', icon: Briefcase, count: 950, color: '#3b82f6' },
  { name: 'Health', icon: Heart, count: 720, color: '#ef4444' },
  { name: 'Lifestyle', icon: Globe, count: 560, color: '#14b8a6' },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Developer at Google',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    content: 'EduLearn transformed my career. The web development course helped me land my dream job at Google. The instructors are world-class and the content is always up-to-date.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Data Scientist at Amazon',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    content: 'The Machine Learning course was exactly what I needed. Clear explanations, practical projects, and a supportive community. Highly recommend for anyone entering the field.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'UX Designer at Airbnb',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    content: 'As a self-taught designer, EduLearn filled in all the gaps in my knowledge. The design courses are comprehensive and the projects helped me build an impressive portfolio.',
    rating: 5,
  },
];

const instructors = [
  {
    id: 1,
    name: 'Dr. Angela Yu',
    specialty: 'Web Development',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    students: 2500000,
    courses: 12,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Jonas Schmedtmann',
    specialty: 'JavaScript & React',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    students: 1800000,
    courses: 8,
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Maximilian Schwarzmüller',
    specialty: 'Full Stack Development',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    students: 2100000,
    courses: 15,
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Jose Portilla',
    specialty: 'Python & Data Science',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    students: 3200000,
    courses: 20,
    rating: 4.6,
  },
];

const stats = [
  { value: '50K+', label: 'Online Courses', icon: BookOpen },
  { value: '10M+', label: 'Students Worldwide', icon: Users },
  { value: '500+', label: 'Expert Instructors', icon: Award },
  { value: '150+', label: 'Countries Reached', icon: Globe },
];

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <Badge variant="primary" size="lg" className="hero-badge">
              🎓 #1 Online Learning Platform
            </Badge>
            <h1 className="hero-title">
              Transform Your Future with 
              <span className="hero-title-highlight"> World-Class Learning</span>
            </h1>
            <p className="hero-description">
              Join millions of learners and access over 50,000 courses taught by 
              industry experts. Learn at your own pace, anywhere, anytime.
            </p>
            <div className="hero-actions">
              <Link to="/courses">
                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                  Explore Courses
                </Button>
              </Link>
              <Button variant="outline" size="lg" leftIcon={<Play size={20} />}>
                Watch Demo
              </Button>
            </div>
            <div className="hero-trust">
              <div className="hero-avatars">
                <Avatar src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50" size="sm" />
                <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" size="sm" />
                <Avatar src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50" size="sm" />
                <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50" size="sm" />
              </div>
              <div className="hero-trust-text">
                <div className="hero-trust-rating">
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <span>4.9/5</span>
                </div>
                <span>from 50,000+ reviews</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" 
              alt="Students learning"
            />
            <div className="hero-float-card hero-float-card-1">
              <div className="hero-float-icon">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="hero-float-value">1.2M+</p>
                <p className="hero-float-label">Course Completions</p>
              </div>
            </div>
            <div className="hero-float-card hero-float-card-2">
              <div className="hero-float-icon hero-float-icon-success">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="hero-float-value">95%</p>
                <p className="hero-float-label">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <stat.icon size={28} />
                </div>
                <div className="stat-content">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section featured-courses">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Courses</h2>
              <p className="section-subtitle">
                Expand your skills with our top-rated courses taught by industry experts
              </p>
            </div>
            <Link to="/courses" className="section-link">
              View all courses <ArrowRight size={16} />
            </Link>
          </div>
          <div className="courses-grid">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header section-header-center">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">
              Explore our wide range of categories and find the perfect course for you
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                to={`/courses?category=${category.name.toLowerCase()}`}
                className="category-card"
              >
                <div 
                  className="category-icon" 
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  <category.icon size={28} />
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count.toLocaleString()} Courses</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-content">
              <Badge variant="primary" className="why-badge">Why EduLearn?</Badge>
              <h2 className="why-title">The Best Platform for Online Learning</h2>
              <p className="why-description">
                We provide the tools and resources you need to succeed in your learning journey. 
                Our platform is designed with learners in mind.
              </p>
              <ul className="why-features">
                <li>
                  <CheckCircle size={20} className="why-check" />
                  <div>
                    <h4>Learn from Industry Experts</h4>
                    <p>Our instructors are professionals with real-world experience</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} className="why-check" />
                  <div>
                    <h4>Flexible Learning Schedule</h4>
                    <p>Study at your own pace, whenever and wherever you want</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} className="why-check" />
                  <div>
                    <h4>Lifetime Access</h4>
                    <p>Once enrolled, access your courses forever</p>
                  </div>
                </li>
                <li>
                  <CheckCircle size={20} className="why-check" />
                  <div>
                    <h4>Certificate of Completion</h4>
                    <p>Earn recognized certificates to showcase your skills</p>
                  </div>
                </li>
              </ul>
              <Link to="/about">
                <Button variant="primary" rightIcon={<ArrowRight size={18} />}>
                  Learn More About Us
                </Button>
              </Link>
            </div>
            <div className="why-image">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600" 
                alt="Learning platform features"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Top Instructors Section */}
      <section className="section instructors-section">
        <div className="container">
          <div className="section-header section-header-center">
            <h2 className="section-title">Learn from the Best</h2>
            <p className="section-subtitle">
              Our instructors are industry experts with years of experience
            </p>
          </div>
          <div className="instructors-grid">
            {instructors.map((instructor) => (
              <Link 
                key={instructor.id} 
                to={`/instructors/${instructor.id}`}
                className="instructor-card"
              >
                <div className="instructor-avatar">
                  <img src={instructor.avatar} alt={instructor.name} />
                </div>
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-specialty">{instructor.specialty}</p>
                <div className="instructor-stats">
                  <div className="instructor-stat">
                    <Users size={14} />
                    <span>{(instructor.students / 1000000).toFixed(1)}M students</span>
                  </div>
                  <div className="instructor-stat">
                    <BookOpen size={14} />
                    <span>{instructor.courses} courses</span>
                  </div>
                </div>
                <div className="instructor-rating">
                  <Rating value={instructor.rating} size="sm" showValue />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/instructors">
              <Button variant="outline" rightIcon={<ArrowRight size={18} />}>
                View All Instructors
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header section-header-center">
            <h2 className="section-title">What Our Students Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied learners who have transformed their careers
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="testimonial-card" padding="lg">
                <Rating value={testimonial.rating} size="md" />
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="testimonial-author">
                  <Avatar src={testimonial.avatar} name={testimonial.name} size="md" />
                  <div>
                    <p className="testimonial-name">{testimonial.name}</p>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Learning Journey?</h2>
            <p className="cta-description">
              Join millions of learners worldwide and unlock your potential today.
              Get started with a free trial.
            </p>
            <div className="cta-actions">
              <Link to="/signup">
                <Button size="lg" variant="secondary">
                  Get Started for Free
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="cta-btn-outline">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
