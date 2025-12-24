import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/auth.service';
import { Button, Input, Alert, Select } from '../components/ui';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    { value: 'student', label: 'Student - I want to learn' },
    { value: 'instructor', label: 'Instructor - I want to teach' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const { strength, label: strengthLabel, color: strengthColor } = passwordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Logo */}
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <GraduationCap size={24} />
              </div>
              <span>EduLearn</span>
            </Link>

            {/* Header */}
            <div className="auth-header">
              <h1>Create your account</h1>
              <p>Join millions of learners and start your journey today</p>
            </div>

            {/* Error Alert */}
            {apiError && (
              <Alert variant="error" dismissible onDismiss={() => setApiError('')}>
                {apiError}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                leftIcon={<User size={18} />}
                error={errors.name}
                disabled={loading}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email}
                disabled={loading}
                required
              />

              <div className="password-field">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  leftIcon={<Lock size={18} />}
                  error={errors.password}
                  disabled={loading}
                  required
                />
                {formData.password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div 
                        className="password-strength-fill" 
                        style={{ 
                          width: `${(strength / 5) * 100}%`,
                          backgroundColor: strengthColor 
                        }}
                      />
                    </div>
                    <span className="password-strength-label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                leftIcon={<Lock size={18} />}
                error={errors.confirmPassword}
                disabled={loading}
                required
              />

              <Select
                label="I want to..."
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={roleOptions}
                disabled={loading}
              />

              <div className="auth-terms">
                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.terms) {
                        setErrors((prev) => ({ ...prev, terms: '' }));
                      }
                    }}
                  />
                  <span className="checkmark"></span>
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="auth-link">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && <p className="auth-error">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="auth-divider">
              <span>or sign up with</span>
            </div>

            {/* Social Login */}
            <div className="auth-social">
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="auth-social-btn" type="button">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            {/* Footer */}
            <p className="auth-footer">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image/Info */}
        <div className="auth-info-section auth-info-section-signup">
          <div className="auth-info-content">
            <h2>Why join EduLearn?</h2>
            <div className="auth-info-benefits">
              <div className="auth-info-benefit">
                <CheckCircle size={24} />
                <div>
                  <h4>50,000+ Courses</h4>
                  <p>Learn anything from web development to photography</p>
                </div>
              </div>
              <div className="auth-info-benefit">
                <CheckCircle size={24} />
                <div>
                  <h4>Expert Instructors</h4>
                  <p>Learn from industry professionals and thought leaders</p>
                </div>
              </div>
              <div className="auth-info-benefit">
                <CheckCircle size={24} />
                <div>
                  <h4>Learn at Your Pace</h4>
                  <p>Access courses anytime, anywhere, on any device</p>
                </div>
              </div>
              <div className="auth-info-benefit">
                <CheckCircle size={24} />
                <div>
                  <h4>Earn Certificates</h4>
                  <p>Get recognized credentials to boost your career</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
