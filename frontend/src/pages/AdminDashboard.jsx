import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button, Card, Badge, Avatar } from '../components/ui';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Mock data - replace with API calls
  const dashboardStats = {
    totalUsers: 15420,
    totalCourses: 892,
    totalEnrollments: 45670,
    totalRevenue: 1245678,
    usersByRole: {
      students: 14200,
      instructors: 1150,
      admins: 70,
    },
    recentUsers: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        avatar: 'https://i.pravatar.cc/150?img=13',
        joinedAt: '2024-12-20',
        isActive: true,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'instructor',
        avatar: 'https://i.pravatar.cc/150?img=1',
        joinedAt: '2024-12-19',
        isActive: true,
      },
    ],
    topCourses: [
      {
        id: 1,
        title: 'Complete Web Development 2024',
        instructor: 'John Doe',
        students: 8934,
        revenue: 752586,
        rating: 4.8,
      },
      {
        id: 2,
        title: 'Machine Learning A-Z',
        instructor: 'Jane Smith',
        students: 7520,
        revenue: 713400,
        rating: 4.9,
      },
    ],
  };

  const allUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student',
      avatar: 'https://i.pravatar.cc/150?img=13',
      courses: 12,
      joined: '2024-01-15',
      isActive: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'instructor',
      avatar: 'https://i.pravatar.cc/150?img=1',
      courses: 8,
      joined: '2024-02-20',
      isActive: true,
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'student',
      avatar: 'https://i.pravatar.cc/150?img=8',
      courses: 5,
      joined: '2024-03-10',
      isActive: false,
    },
  ];

  const allCourses = [
    {
      id: 1,
      title: 'Complete Web Development 2024',
      instructor: 'John Doe',
      category: 'Development',
      students: 8934,
      price: 84.99,
      status: 'published',
      rating: 4.8,
      featured: true,
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      instructor: 'Jane Smith',
      category: 'Data Science',
      students: 7520,
      price: 94.99,
      status: 'published',
      rating: 4.9,
      featured: true,
    },
    {
      id: 3,
      title: 'UI/UX Design Masterclass',
      instructor: 'Mike Johnson',
      category: 'Design',
      students: 4560,
      price: 79.99,
      status: 'draft',
      rating: 4.7,
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom py-12">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-primary-100">Manage your platform, users, and content</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom py-8">
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8">
            {['overview', 'users', 'courses', 'reviews', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardStats.totalUsers.toLocaleString()}
                      </p>
                      <p className="text-sm text-success-600 mt-2">↑ 12% from last month</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardStats.totalCourses}
                      </p>
                      <p className="text-sm text-success-600 mt-2">↑ 8% from last month</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-success-100 text-success-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Enrollments</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {dashboardStats.totalEnrollments.toLocaleString()}
                      </p>
                      <p className="text-sm text-success-600 mt-2">↑ 23% from last month</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-warning-100 text-warning-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${(dashboardStats.totalRevenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-success-600 mt-2">↑ 18% from last month</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-secondary-100 text-secondary-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Top Courses */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Top Performing Courses</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {dashboardStats.topCourses.map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-600">{course.students.toLocaleString()} students</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${(course.revenue / 1000).toFixed(0)}K</p>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span className="text-warning-400">★</span>
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Recent Users */}
              <Card>
                <Card.Header>
                  <h3 className="text-lg font-semibold">Recent Registrations</h3>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {dashboardStats.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} alt={user.name} size="md" />
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={user.role === 'instructor' ? 'primary' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{user.joinedAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="instructor">Instructors</option>
                  <option value="admin">Admins</option>
                </select>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar src={user.avatar} alt={user.name} size="sm" />
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'primary' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.courses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={user.isActive ? 'success' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button className="text-primary-600 hover:text-primary-700">Edit</button>
                            <button className="text-danger-600 hover:text-danger-700">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Courses</h2>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">All Categories</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                </select>
                <Button variant="primary">Add Course</Button>
              </div>
            </div>

            <div className="grid gap-6">
              {allCourses.map((course) => (
                <Card key={course.id}>
                  <Card.Body>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          {course.featured && <Badge variant="warning">Featured</Badge>}
                          <Badge variant={course.status === 'published' ? 'success' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          By {course.instructor} • {course.category}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <span>{course.students.toLocaleString()} students</span>
                          <span className="flex items-center gap-1">
                            <span className="text-warning-400">★</span>
                            {course.rating}
                          </span>
                          <span className="font-semibold text-gray-900">${course.price}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">
                          {course.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button variant="danger" size="sm">Delete</Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Review Management</h2>
            <Card>
              <Card.Body>
                <p className="text-gray-600">Review management features coming soon...</p>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
            <Card>
              <Card.Body>
                <p className="text-gray-600">Platform settings coming soon...</p>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
