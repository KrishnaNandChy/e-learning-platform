import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input, Alert } from '../components/ui';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setLoading(true);
    setError('');

    try {
      // API call would go here
      // await forgotPassword({ email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-container auth-container-centered">
          <div className="auth-form-section auth-form-section-centered">
            <div className="auth-form-wrapper">
              <Link to="/" className="auth-logo">
                <div className="auth-logo-icon">
                  <GraduationCap size={24} />
                </div>
                <span>EduLearn</span>
              </Link>

              <div className="auth-success">
                <div className="auth-success-icon">
                  <CheckCircle size={48} />
                </div>
                <h1>Check your email</h1>
                <p>
                  We&apos;ve sent password reset instructions to{' '}
                  <strong>{email}</strong>
                </p>
                <p className="auth-success-hint">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button 
                    type="button" 
                    className="auth-link-button"
                    onClick={() => setSubmitted(false)}
                  >
                    try another email address
                  </button>
                </p>
              </div>

              <Link to="/login">
                <Button variant="outline" fullWidth leftIcon={<ArrowLeft size={18} />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-centered">
        <div className="auth-form-section auth-form-section-centered">
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
              <h1>Forgot password?</h1>
              <p>
                No worries! Enter your email address and we&apos;ll send you 
                instructions to reset your password.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="error" dismissible onDismiss={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                error={error}
                disabled={loading}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Send Reset Instructions
              </Button>
            </form>

            {/* Footer */}
            <div className="auth-back-link">
              <Link to="/login" className="auth-link">
                <ArrowLeft size={16} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
