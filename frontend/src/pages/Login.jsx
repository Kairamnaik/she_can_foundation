import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { authService } from '../services/api';

const Login = ({ showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }

    // Check if redirected due to expired token session
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('expired') === 'true') {
      showToast('Admin session expired. Please log in again.', 'error');
    }
  }, [navigate, location, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(email.trim(), password);
      if (data.success) {
        showToast('Access Granted. Welcome Admin!', 'success');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
        showToast(data.message || 'Invalid email or password', 'error');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      const msg = err.response?.data?.message || 'Connection error. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Mesh background glows */}
      <div className="mesh-bg">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
      </div>

      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 mb-4 transform hover:rotate-6 transition-transform">
            <Shield size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-slate-400 text-sm">
            Sign in to access the message database and analytics.
          </p>
        </div>

        {/* Login Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 to-accent-500"></div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start space-x-2 animate-shake">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shecanfoundation.org"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl form-input-premium"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl form-input-premium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit btn */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 disabled:hover:from-primary-600 disabled:hover:to-accent-600 disabled:cursor-not-allowed text-white shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-300 cursor-pointer"
            >
              {isLoading ? (
                <div className="spinner-premium border-2 border-t-white"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Credentials hints card */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Default Credentials:</span><br />
          Email: <code className="text-primary-300 bg-transparent p-0">admin@shecanfoundation.org</code> &bull; Password: <code className="text-primary-300 bg-transparent p-0">admin12345</code>
        </div>
      </div>
    </div>
  );
};

export default Login;
