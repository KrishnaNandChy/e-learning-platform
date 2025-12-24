import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  Bell,
  ChevronRight,
  Target,
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Avatar, ProgressBar } from '../../components/ui';
import api from '../../services/api';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    learningHours: 0,
    streak: 7,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesRes, notificationsRes] = await Promise.all([
        api.get('/courses/user/enrolled'),
        api.get('/notifications?limit=5'),
      ]);

      const courses = coursesRes.data.data || [];
      setEnrolledCourses(courses);
      setNotifications(notificationsRes.data.data || []);

      // Calculate stats
      const completed = courses.filter(c => c.progress >= 100).length;
      const totalLessons = courses.reduce((acc, c) => acc + (c.course?.totalLessons || 0) * (c.progress / 100), 0);
      
      setStats({
        totalCourses: courses.length,
        completedCourses: completed,
        totalLessons: Math.round(totalLessons),
        learningHours: Math.round(totalLessons * 0.15),
        streak: 7,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = enrolledCourses.filter(enrollment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return enrollment.progress < 100;
    if (activeTab === 'completed') return enrollment.progress >= 100;
    return true;
  });

  const continueLearningCourse = enrolledCourses.find(e => e.progress > 0 && e.progress < 100) || enrolledCourses[0];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <Avatar name={user?.name} src={user?.avatar} size="xl" />
            <div className="dashboard-welcome-text">
              <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p>Continue your learning journey</p>
            </div>
          </div>
          <div className="dashboard-streak">
            <div className="streak-icon">
              <Flame size={24} />
            </div>
            <div className="streak-info">
              <span className="streak-count">{stats.streak}</span>
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
              <span className="stat-value">{stats.totalCourses}</span>
              <span className="stat-label">Enrolled Courses</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-success">
              <Trophy size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.completedCourses}</span>
              <span className="stat-label">Completed</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-warning">
              <Target size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalLessons}</span>
              <span className="stat-label">Lessons Done</span>
            </div>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-info">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.learningHours}h</span>
              <span className="stat-label">Learning Time</span>
            </div>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Main Content */}
          <div className="dashboard-main">
            {/* Continue Learning */}
            {continueLearningCourse && (
              <Card className="continue-learning" padding="none">
                <div className="continue-learning-content">
                  <div className="continue-learning-info">
                    <Badge variant="primary" size="sm">Continue Learning</Badge>
                    <h3>{continueLearningCourse.course?.title || 'Your Course'}</h3>
                    <p>Progress: {continueLearningCourse.progress}% complete</p>
                    <ProgressBar 
                      value={continueLearningCourse.progress} 
                      showLabel 
                      size="md"
                      variant="primary"
                    />
                    <Link to={`/courses/${continueLearningCourse.course?._id}/learn`}>
                      <Button variant="primary" leftIcon={<Play size={18} />}>
                        Resume Learning
                      </Button>
                    </Link>
                  </div>
                  <div className="continue-learning-image">
                    <img 
                      src={continueLearningCourse.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
                      alt="" 
                    />
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
                    All ({stats.totalCourses})
                  </button>
                  <button 
                    className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('in-progress')}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="courses-list">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(enrollment => (
                    <Card key={enrollment.course?._id} className="enrolled-course-card" hoverable>
                      <div className="enrolled-course-thumbnail">
                        <img 
                          src={enrollment.course?.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
                          alt={enrollment.course?.title} 
                        />
                        {enrollment.progress >= 100 && (
                          <div className="course-completed-badge">
                            <Award size={20} />
                          </div>
                        )}
                      </div>
                      <div className="enrolled-course-info">
                        <h4>{enrollment.course?.title}</h4>
                        <p className="enrolled-course-instructor">
                          {enrollment.course?.instructor?.name || 'Instructor'}
                        </p>
                        <div className="enrolled-course-progress">
                          <ProgressBar 
                            value={enrollment.progress} 
                            size="sm" 
                            variant={enrollment.progress >= 100 ? 'success' : 'primary'}
                          />
                          <span>{enrollment.progress}% complete</span>
                        </div>
                      </div>
                      <div className="enrolled-course-action">
                        <Link to={`/courses/${enrollment.course?._id}/learn`}>
                          <Button 
                            variant={enrollment.progress >= 100 ? 'outline' : 'primary'} 
                            size="sm"
                          >
                            {enrollment.progress >= 100 ? 'View Certificate' : 'Continue'}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="courses-empty">
                    <BookOpen size={48} />
                    <p>No courses yet</p>
                    <Link to="/courses">
                      <Button variant="primary">Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </div>
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
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="var(--primary-500)" 
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={`${(5/7) * 283} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="goal-text">
                    <span className="goal-current">5</span>
                    <span className="goal-target">/ 7 days</span>
                  </div>
                </div>
                <p>Keep going! You're almost there.</p>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="notifications-card" padding="lg">
              <div className="notifications-header">
                <h3>Notifications</h3>
                {notifications.length > 0 && (
                  <Badge variant="primary" size="sm" rounded>
                    {notifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification._id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        <Bell size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">{notification.title}</p>
                        <p className="notification-message">{notification.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No new notifications</p>
                )}
              </div>
              <Link to="/notifications" className="notifications-link">
                View all <ChevronRight size={16} />
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
