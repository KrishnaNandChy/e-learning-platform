import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  Star,
  Plus,
  TrendingUp,
  Eye,
  Edit,
  BarChart,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Avatar, ProgressBar, Rating } from '../../components/ui';
import api from '../../services/api';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/instructor/my-courses');
      const courseData = response.data.data || [];
      setCourses(courseData);

      // Calculate stats
      const published = courseData.filter(c => c.isPublished).length;
      const totalStudents = courseData.reduce((acc, c) => acc + (c.totalStudents || 0), 0);
      const totalRevenue = courseData.reduce((acc, c) => acc + (c.price * (c.totalStudents || 0)), 0);
      const ratings = courseData.filter(c => c.rating > 0);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((acc, c) => acc + c.rating, 0) / ratings.length 
        : 0;

      setStats({
        totalCourses: courseData.length,
        publishedCourses: published,
        totalStudents,
        totalRevenue,
        avgRating: Math.round(avgRating * 10) / 10,
        totalReviews: courseData.reduce((acc, c) => acc + (c.totalReviews || 0), 0),
      });
    } catch (error) {
      console.error('Failed to fetch instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <Avatar name={user?.name} src={user?.avatar} size="xl" />
            <div className="dashboard-welcome-text">
              <h1>Welcome, {user?.name?.split(' ')[0]}!</h1>
              <p>Manage your courses and track your performance</p>
            </div>
          </div>
          <Link to="/instructor/courses/create">
            <Button variant="primary" leftIcon={<Plus size={18} />}>
              Create New Course
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats instructor-stats">
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-primary">
              <BookOpen size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalCourses}</span>
              <span className="stat-label">Total Courses</span>
            </div>
            <span className="stat-badge">{stats.publishedCourses} Published</span>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-success">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalStudents.toLocaleString()}</span>
              <span className="stat-label">Total Students</span>
            </div>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +12%
            </span>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-warning">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-label">Total Earnings</span>
            </div>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> +8%
            </span>
          </Card>
          <Card className="stat-card" padding="lg">
            <div className="stat-icon stat-icon-info">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stats.avgRating}</span>
              <span className="stat-label">Average Rating</span>
            </div>
            <span className="stat-reviews">{stats.totalReviews.toLocaleString()} reviews</span>
          </Card>
        </div>

        <div className="dashboard-grid">
          {/* Main Content */}
          <div className="dashboard-main">
            {/* Courses Section */}
            <div className="instructor-courses">
              <div className="section-header">
                <h2>Your Courses</h2>
                <Link to="/instructor/courses">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>

              <div className="courses-table">
                <div className="table-header">
                  <span>Course</span>
                  <span>Students</span>
                  <span>Rating</span>
                  <span>Revenue</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div key={course._id} className="table-row">
                      <div className="course-info">
                        <img src={course.thumbnail} alt={course.title} />
                        <div>
                          <h4>{course.title}</h4>
                          <p>{course.category}</p>
                        </div>
                      </div>
                      <span className="students">{course.totalStudents?.toLocaleString() || 0}</span>
                      <span className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {course.rating || 'N/A'}
                      </span>
                      <span className="revenue">₹{((course.price || 0) * (course.totalStudents || 0)).toLocaleString()}</span>
                      <span>
                        <Badge variant={course.isPublished ? 'success' : 'warning'} size="sm">
                          {course.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </span>
                      <div className="actions">
                        <Link to={`/instructor/courses/${course._id}/edit`}>
                          <Button variant="ghost" size="xs">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Link to={`/courses/${course._id}`}>
                          <Button variant="ghost" size="xs">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link to={`/instructor/courses/${course._id}/analytics`}>
                          <Button variant="ghost" size="xs">
                            <BarChart size={16} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <BookOpen size={48} />
                    <p>No courses yet</p>
                    <Link to="/instructor/courses/create">
                      <Button variant="primary">Create Your First Course</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            <Card className="recent-reviews" padding="lg">
              <div className="section-header">
                <h3>Recent Reviews</h3>
                <Link to="/instructor/reviews">View All</Link>
              </div>
              <div className="reviews-list">
                <div className="review-placeholder">
                  <MessageSquare size={32} />
                  <p>Reviews will appear here</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="dashboard-sidebar">
            {/* Quick Actions */}
            <Card className="quick-actions" padding="lg">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <Link to="/instructor/courses/create" className="action-item">
                  <Plus size={20} />
                  <span>Create Course</span>
                </Link>
                <Link to="/instructor/analytics" className="action-item">
                  <BarChart size={20} />
                  <span>View Analytics</span>
                </Link>
                <Link to="/instructor/earnings" className="action-item">
                  <DollarSign size={20} />
                  <span>Earnings Report</span>
                </Link>
                <Link to="/instructor/students" className="action-item">
                  <Users size={20} />
                  <span>Manage Students</span>
                </Link>
              </div>
            </Card>

            {/* Performance Card */}
            <Card className="performance-card" padding="lg">
              <h3>This Month</h3>
              <div className="performance-stats">
                <div className="perf-stat">
                  <span className="perf-label">New Enrollments</span>
                  <span className="perf-value">+127</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-label">Course Completions</span>
                  <span className="perf-value">43</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-label">New Reviews</span>
                  <span className="perf-value">18</span>
                </div>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="tips-card" padding="lg">
              <h3>💡 Instructor Tips</h3>
              <ul className="tips-list">
                <li>Add preview videos to increase enrollments</li>
                <li>Respond to student questions within 24 hours</li>
                <li>Update course content regularly</li>
                <li>Create engaging quizzes and assignments</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
