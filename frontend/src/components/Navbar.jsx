import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogOut, Home as HomeIcon, LayoutDashboard } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listen for scroll events to add dynamic shadows/blur
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled || setIsScrolled(true);
      } else {
        isScrolled && setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Keep authenticated state in sync with URL transitions
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 py-4 shadow-lg shadow-slate-950/20' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-primary-600 to-accent-500 p-2 rounded-xl shadow-md shadow-primary-500/20 transform group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-lg tracking-wider">SC</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
              She Can <span className="text-primary-400 font-medium">Foundation</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-slate-800/60 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <HomeIcon size={16} />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-slate-800/60 text-white' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/login') 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50 border border-transparent hover:border-slate-800'
                }`}
              >
                <Shield size={16} />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white p-2 rounded-lg focus:outline-none hover:bg-slate-900/80 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-950 border-b border-slate-800/60 px-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'
            }`}
          >
            <HomeIcon size={18} />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive('/dashboard') ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-medium ${
                isActive('/login') ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              <Shield size={18} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
