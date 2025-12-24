import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Globe, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Assuming AuthContext provides these
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 hidden sm:block">EduPlatform</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition duration-150 ease-in-out"
                placeholder="Search for anything"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/courses" className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary transition">
              Categories
            </Link>
            
            {/* Instructor Mode - Mock */}
            <Link to="/instructor/dashboard" className="hidden lg:block text-sm font-medium text-gray-700 hover:text-primary transition">
              Teach on EduPlatform
            </Link>

            <button className="p-2 hover:bg-gray-100 rounded-full transition relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">2</span> */}
            </button>

            {user ? (
              <div className="relative ml-3 flex items-center gap-3">
                 <Link to="/dashboard" className="hidden md:block text-sm font-medium text-gray-700 hover:text-primary">
                    My Learning
                 </Link>
                <div className="relative group">
                    <button className="flex items-center max-w-xs bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                    </button>
                    {/* Dropdown */}
                    <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                        <div className="py-1">
                            <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        </div>
                        <div className="py-1">
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</button>
                        </div>
                    </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Log in
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-black shadow-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <div className="p-2">
                <input
                    type="text"
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                    placeholder="Search for anything"
                />
             </div>
            <Link to="/courses" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Categories</Link>
            <Link to="/instructor/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Teach</Link>
            {!user && (
                 <>
                    <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Log in</Link>
                    <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50">Sign up</Link>
                 </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
