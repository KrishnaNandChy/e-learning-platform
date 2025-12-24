import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

// Dashboards
import StudentDashboard from './pages/dashboards/StudentDashboard';
import InstructorDashboard from './pages/dashboards/InstructorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute';

// Styles
import './index.css';

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Layout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <MainLayout>
              <Courses />
            </MainLayout>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <MainLayout>
              <CourseDetail />
            </MainLayout>
          }
        />

        {/* Auth Routes (No Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Route - Auto routes based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout showFooter={false}>
                <DashboardRouter />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Role-specific dashboard routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute roles={['student']}>
              <MainLayout showFooter={false}>
                <StudentDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <MainLayout showFooter={false}>
                <InstructorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Instructor Course Management */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute roles={['instructor', 'admin']}>
              <MainLayout showFooter={false}>
                <InstructorDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - 404 */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Simple 404 Component
function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: '#6366f1', margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500',
        }}
      >
        Go Back Home
      </a>
    </div>
  );
}

export default App;
