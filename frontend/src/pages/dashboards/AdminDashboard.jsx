import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Card, Badge, Avatar, Input, Select, Modal } from '../../components/ui';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    publishedCourses: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  
  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      const data = response.data.data;

      setStats({
        totalUsers: data.overview.totalUsers,
        totalStudents: data.overview.totalStudents,
        totalInstructors: data.overview.totalInstructors,
        totalCourses: data.overview.totalCourses,
        publishedCourses: data.overview.publishedCourses,
        totalRevenue: 0, // Calculate from courses
      });

      setRecentUsers(data.recentUsers || []);
      setRecentCourses(data.recentCourses || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = {};
      if (userSearch) params.search = userSearch;
      if (userRoleFilter) params.role = userRoleFilter;

      const response = await api.get('/admin/users', { params });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const params = {};
      if (courseSearch) params.search = courseSearch;

      const response = await api.get('/admin/courses', { params });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'courses') {
      fetchCourses();
    }
  }, [activeTab, userSearch, userRoleFilter, courseSearch]);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleToggleFeatured = async (courseId) => {
    try {
      await api.put(`/admin/courses/${courseId}/feature`);
      fetchCourses();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <Shield size={24} />
            <span>Admin Panel</span>
          </div>
          <nav className="admin-nav">
            <button 
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp size={20} />
              <span>Overview</span>
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={20} />
              <span>Courses</span>
            </button>
            <button 
              className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <div className="admin-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, {user?.name}</p>
              </div>

              {/* Stats Grid */}
              <div className="admin-stats">
                <Card className="admin-stat-card" padding="lg">
                  <div className="stat-icon stat-icon-primary">
                    <Users size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalUsers}</span>
                    <span className="stat-label">Total Users</span>
                  </div>
                  <div className="stat-breakdown">
                    <span>{stats.totalStudents} Students</span>
                    <span>{stats.totalInstructors} Instructors</span>
                  </div>
                </Card>

                <Card className="admin-stat-card" padding="lg">
                  <div className="stat-icon stat-icon-success">
                    <BookOpen size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCourses}</span>
                    <span className="stat-label">Total Courses</span>
                  </div>
                  <div className="stat-breakdown">
                    <span>{stats.publishedCourses} Published</span>
                    <span>{stats.totalCourses - stats.publishedCourses} Draft</span>
                  </div>
                </Card>

                <Card className="admin-stat-card" padding="lg">
                  <div className="stat-icon stat-icon-warning">
                    <DollarSign size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
                    <span className="stat-label">Total Revenue</span>
                  </div>
                </Card>

                <Card className="admin-stat-card" padding="lg">
                  <div className="stat-icon stat-icon-info">
                    <TrendingUp size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">+12%</span>
                    <span className="stat-label">Growth Rate</span>
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="admin-recent">
                <Card className="recent-card" padding="lg">
                  <h3>Recent Users</h3>
                  <div className="recent-list">
                    {recentUsers.map(user => (
                      <div key={user._id} className="recent-item">
                        <Avatar name={user.name} size="sm" />
                        <div className="recent-info">
                          <span className="recent-name">{user.name}</span>
                          <span className="recent-meta">{user.email}</span>
                        </div>
                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'primary' : 'default'} size="sm">
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <button className="view-all-btn" onClick={() => setActiveTab('users')}>
                    View All Users
                  </button>
                </Card>

                <Card className="recent-card" padding="lg">
                  <h3>Recent Courses</h3>
                  <div className="recent-list">
                    {recentCourses.map(course => (
                      <div key={course._id} className="recent-item">
                        <img src={course.thumbnail} alt="" className="recent-thumb" />
                        <div className="recent-info">
                          <span className="recent-name">{course.title}</span>
                          <span className="recent-meta">{course.instructor?.name}</span>
                        </div>
                        <Badge variant={course.isPublished ? 'success' : 'warning'} size="sm">
                          {course.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <button className="view-all-btn" onClick={() => setActiveTab('courses')}>
                    View All Courses
                  </button>
                </Card>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-users">
              <div className="admin-header">
                <h1>User Management</h1>
                <Button variant="primary" leftIcon={<UserPlus size={18} />}>
                  Add User
                </Button>
              </div>

              {/* Filters */}
              <div className="admin-filters">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>
                <Select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  options={[
                    { value: '', label: 'All Roles' },
                    { value: 'student', label: 'Students' },
                    { value: 'instructor', label: 'Instructors' },
                    { value: 'admin', label: 'Admins' },
                  ]}
                  placeholder="Filter by role"
                />
              </div>

              {/* Users Table */}
              <Card className="data-table" padding="none">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>
                          <div className="user-cell">
                            <Avatar name={user.name} src={user.avatar} size="sm" />
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge 
                            variant={user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'primary' : 'default'} 
                            size="sm"
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="table-actions">
                            <button title="View"><Eye size={16} /></button>
                            <button title="Edit"><Edit size={16} /></button>
                            <button 
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                              onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            >
                              {user.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="admin-courses">
              <div className="admin-header">
                <h1>Course Management</h1>
              </div>

              {/* Filters */}
              <div className="admin-filters">
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Courses Table */}
              <Card className="data-table" padding="none">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Instructor</th>
                      <th>Category</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course._id}>
                        <td>
                          <div className="course-cell">
                            <img src={course.thumbnail} alt="" />
                            <span>{course.title}</span>
                          </div>
                        </td>
                        <td>{course.instructor?.name}</td>
                        <td>{course.category}</td>
                        <td>{course.totalStudents || 0}</td>
                        <td>
                          <Badge variant={course.isPublished ? 'success' : 'warning'} size="sm">
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td>
                          <button 
                            className={`feature-btn ${course.isFeatured ? 'featured' : ''}`}
                            onClick={() => handleToggleFeatured(course._id)}
                          >
                            <Star size={16} fill={course.isFeatured ? '#fbbf24' : 'none'} />
                          </button>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link to={`/courses/${course._id}`}><Eye size={16} /></Link>
                            <button><Edit size={16} /></button>
                            <button><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="admin-settings">
              <div className="admin-header">
                <h1>Platform Settings</h1>
              </div>
              <Card padding="lg">
                <p>Settings panel coming soon...</p>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
