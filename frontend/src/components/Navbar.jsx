import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  BookOpen, 
  LayoutDashboard, 
  LogOut,
  Bell,
  ShoppingCart,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Avatar } from './ui';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { path: '/courses', label: 'Browse Courses' },
    { path: '/categories', label: 'Categories' },
    { path: '/instructors', label: 'Become an Instructor' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <GraduationCap size={28} />
          </div>
          <span className="navbar-logo-text">EduLearn</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? 'navbar-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search Bar */}
        <div className={`navbar-search ${isSearchOpen ? 'navbar-search-open' : ''}`}>
          <form onSubmit={handleSearch} className="navbar-search-form">
            <Search size={18} className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar-search-input"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {/* Mobile Search Toggle */}
          <button
            className="navbar-icon-btn navbar-search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {user ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="navbar-icon-btn">
                <ShoppingCart size={20} />
              </Link>

              {/* Notifications */}
              <button className="navbar-icon-btn navbar-notifications">
                <Bell size={20} />
                <span className="navbar-notification-badge">3</span>
              </button>

              {/* Profile Dropdown */}
              <div className="navbar-profile">
                <button
                  className="navbar-profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                >
                  <Avatar 
                    name={user.name} 
                    src={user.avatar} 
                    size="sm" 
                  />
                  <ChevronDown size={16} className={`navbar-profile-chevron ${isProfileOpen ? 'rotated' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div className="navbar-dropdown-overlay" onClick={() => setIsProfileOpen(false)} />
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-header">
                        <Avatar name={user.name} src={user.avatar} size="lg" />
                        <div className="navbar-dropdown-user">
                          <p className="navbar-dropdown-name">{user.name}</p>
                          <p className="navbar-dropdown-email">{user.email}</p>
                        </div>
                      </div>
                      <div className="navbar-dropdown-divider" />
                      <Link to="/dashboard" className="navbar-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/my-courses" className="navbar-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <BookOpen size={18} />
                        <span>My Courses</span>
                      </Link>
                      <Link to="/profile" className="navbar-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <User size={18} />
                        <span>Profile Settings</span>
                      </Link>
                      <div className="navbar-dropdown-divider" />
                      <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="navbar-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-search">
            <form onSubmit={handleSearch}>
              <Search size={18} className="navbar-search-icon" />
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <div className="navbar-mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="navbar-mobile-auth">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" fullWidth>Log In</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" fullWidth>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
