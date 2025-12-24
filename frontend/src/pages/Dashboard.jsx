import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Play, 
  Calendar,
  Bell,
  ChevronRight,
  Target,
  Flame,
  Trophy,
  BarChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Badge, Avatar, ProgressBar } from '../components/ui';
import './Dashboard.css';

// Mock data for demonstration
const mockEnrolledCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp 2024',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    instructor: 'Dr. Angela Yu',
    progress: 65,
    lastAccessed: '2 hours ago',
    nextLesson: 'JavaScript Arrays and Objects',
    totalLessons: 478,
    completedLessons: 310,
    duration: '65h 30m',
  },
  {
    id: 2,
    title: 'React - The Complete Guide 2024',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    instructor: 'Maximilian Schwarzmüller',
    progress: 35,
    lastAccessed: '1 day ago',
    nextLesson: 'React Hooks Deep Dive',
    totalLessons: 320,
    completedLessons: 112,
    duration: '48h',
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    instructor: 'Daniel Scott',
    progress: 100,
    lastAccessed: '1 week ago',
    nextLesson: null,
    totalLessons: 150,
    completedLessons: 150,
    duration: '32h 20m',
    completed: true,
  },
];

const mockRecommendedCourses = [
  {
    id: 4,
    title: 'Node.js, Express, MongoDB & More',
    thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400',
    instructor: 'Jonas Schmedtmann',
    price: 599,
    rating: 4.8,
  },
  {
    id: 5,
    title: 'Advanced CSS and Sass',
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
    instructor: 'Jonas Schmedtmann',
    price: 449,
    rating: 4.9,
  },
];

const mockNotifications = [
  {
    id: 1,
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    message: 'You completed 300 lessons. Keep going!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'course',
    title: 'Course Update',
    message: 'React course has been updated with new content.',
    time: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Learning Reminder',
    message: "Don't forget to continue your Web Development course!",
    time: '2 days ago',
    read: true,
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [streak, setStreak] = useState(7);

  // Filter courses based on tab
  const filteredCourses = mockEnrolledCourses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return !course.completed;
    if (activeTab === 'completed') return course.completed;
    return true;
  });

  // Calculate stats
  const totalCourses = mockEnrolledCourses.length;
  const completedCourses = mockEnrolledCourses.filter(c => c.completed).length;
  const totalLessons = mockEnrolledCourses.reduce((acc, c) => acc + c.completedLessons, 0);
  const totalHours = Math.round(totalLessons * 0.15);

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <Avatar name={user?.name || 'User'} src={user?.avatar} size="xl" />
            <div className="dashboard-welcome-text">
              <h1>Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!</h1>
              <p>Continue your learning journey</p>
            </div>
          </div>
          <div className="dashboard-streak">
            <div className="streak-icon">
              <Flame size={24} />
            </div>
            <div className="streak-info">
              <span className="streak-count">{streak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-primary">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalCourses}</span>
              <span className="stat-label">Enrolled Courses</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-success">
              <Trophy size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{completedCourses}</span>
              <span className="stat-label">Completed</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-warning">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalLessons}</span>
              <span className="stat-label">Lessons Completed</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-info">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{totalHours}h</span>
              <span className="stat-label">Learning Hours</span>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Main Content */}
          <div className="dashboard-main">
            {/* Continue Learning */}
            {mockEnrolledCourses.find(c => !c.completed) && (
              <Card className="continue-learning" padding="none">
                <div className="continue-learning-content">
                  <div className="continue-learning-info">
                    <Badge variant="primary" size="sm">Continue Learning</Badge>
                    <h3>{mockEnrolledCourses[0].title}</h3>
                    <p>Next: {mockEnrolledCourses[0].nextLesson}</p>
                    <ProgressBar 
                      value={mockEnrolledCourses[0].progress} 
                      showLabel 
                      size="md"
                      variant="primary"
                    />
                    <Link to={`/courses/${mockEnrolledCourses[0].id}/learn`}>
                      <Button variant="primary" leftIcon={<Play size={18} />}>
                        Resume Learning
                      </Button>
                    </Link>
                  </div>
                  <div className="continue-learning-image">
                    <img src={mockEnrolledCourses[0].thumbnail} alt="" />
                  </div>
                </div>
              </Card>
            )}

            {/* My Courses */}
            <div className="my-courses">
              <div className="section-header">
                <h2>My Courses</h2>
                <div className="course-tabs">
                  <button 
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All ({totalCourses})
                  </button>
                  <button 
                    className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in-progress')}
                  >
                    In Progress ({totalCourses - completedCourses})
                  </button>
                  <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed ({completedCourses})
                  </button>
                </div>
              </div>

              <div className="courses-list">
                {filteredCourses.map(course => (
                  <Card key={course.id} className="enrolled-course-card" hoverable>
                    <div className="enrolled-course-thumbnail">
                      <img src={course.thumbnail} alt={course.title} />
                      {course.completed && (
                        <div className="course-completed-badge">
                          <Award size={20} />
                        </div>
                      )}
                    </div>
                    <div className="enrolled-course-info">
                      <h4>{course.title}</h4>
                      <p className="enrolled-course-instructor">{course.instructor}</p>
                      <div className="enrolled-course-progress">
                        <ProgressBar 
                          value={course.progress} 
                          size="sm" 
                          variant={course.completed ? 'success' : 'primary'}
                        />
                        <span>{course.progress}% complete</span>
                      </div>
                      <div className="enrolled-course-meta">
                        <span><Clock size={14} /> Last accessed {course.lastAccessed}</span>
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                    </div>
                    <div className="enrolled-course-action">
                      <Link to={`/courses/${course.id}/learn`}>
                        <Button 
                          variant={course.completed ? 'outline' : 'primary'} 
                          size="sm"
                          leftIcon={course.completed ? <Award size={16} /> : <Play size={16} />}
                        >
                          {course.completed ? 'View Certificate' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="courses-empty">
                  <BookOpen size={48} />
                  <p>No courses found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="dashboard-sidebar">
            {/* Learning Goals */}
            <Card className="learning-goals" padding="lg">
              <h3>Weekly Goal</h3>
              <div className="goal-progress">
                <div className="goal-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="var(--primary-500)" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(5/7) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="goal-text">
                    <span className="goal-current">5</span>
                    <span className="goal-target">/ 7 days</span>
                  </div>
                </div>
                <p>You&apos;re on track! Keep learning to reach your goal.</p>
              </div>
              <Button variant="outline" size="sm" fullWidth>
                Update Goal
              </Button>
            </Card>

            {/* Notifications */}
            <Card className="notifications-card" padding="lg">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <Badge variant="primary" size="sm" rounded>
                  {mockNotifications.filter(n => !n.read).length}
                </Badge>
              </div>
              <div className="notifications-list">
                {mockNotifications.slice(0, 3).map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  >
                    <div className={`notification-icon notification-icon-${notification.type}`}>
                      {notification.type === 'achievement' && <Trophy size={16} />}
                      {notification.type === 'course' && <BookOpen size={16} />}
                      {notification.type === 'reminder' && <Bell size={16} />}
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">{notification.title}</p>
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/notifications" className="notifications-link">
                View all notifications <ChevronRight size={16} />
              </Link>
            </Card>

            {/* Recommended Courses */}
            <Card className="recommended-card" padding="lg">
              <h3>Recommended for You</h3>
              <div className="recommended-list">
                {mockRecommendedCourses.map(course => (
                  <Link 
                    key={course.id} 
                    to={`/courses/${course.id}`}
                    className="recommended-item"
                  >
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="recommended-info">
                      <h4>{course.title}</h4>
                      <p>{course.instructor}</p>
                      <span className="recommended-price">₹{course.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/courses">
                <Button variant="outline" size="sm" fullWidth>
                  Browse More Courses
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
