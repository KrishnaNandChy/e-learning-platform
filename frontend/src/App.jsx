import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute';

// Styles
import './index.css';

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

        {/* Auth Routes (No Layout - Custom design) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['student', 'admin', 'instructor']}>
              <MainLayout showFooter={false}>
                <Dashboard />
              </MainLayout>
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
