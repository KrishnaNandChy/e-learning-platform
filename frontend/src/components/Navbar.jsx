import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Avatar } from './ui';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Mock user data - replace with actual auth context
  const isLoggedIn = false;
  const user = null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    'Development',
    'Business',
    'Design',
    'Marketing',
    'IT & Software',
    'Personal Development',
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">EduLearn</span>
            </Link>

            {/* Categories Dropdown - Desktop */}
            <div className="hidden lg:block">
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <span className="font-medium">Categories</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    {categories.map((category, index) => (
                      <Link
                        key={index}
                        to={`/courses?category=${encodeURIComponent(category)}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className={`relative w-full transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-primary-500 focus:outline-none transition-all duration-200"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Teach Button - Desktop */}
              <Link to="/teach" className="hidden lg:block text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Teach on EduLearn
              </Link>

              {/* Cart Icon */}
              <button className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-danger-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </button>

              {/* Notifications Icon */}
              {isLoggedIn && (
                <button className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 bg-danger-500 w-2 h-2 rounded-full"></span>
                </button>
              )}

              {/* User Menu or Login Button */}
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    <Avatar 
                      src={user?.avatar} 
                      alt={user?.name}
                      size="sm"
                    />
                  </button>
                  
                  {/* User Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                        My Learning
                      </Link>
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                        Profile
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors">
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button className="block w-full text-left px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" className="hidden sm:block">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white animate-slide-down">
          <div className="container-custom py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:border-primary-500 focus:outline-none"
                />
                <svg 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Mobile Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/courses?category=${encodeURIComponent(category)}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Links */}
            <div className="border-t border-gray-200 pt-4">
              <Link 
                to="/teach" 
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Teach on EduLearn
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
