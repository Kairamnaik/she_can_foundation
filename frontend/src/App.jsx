import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [toasts, setToasts] = useState([]);

  // Toast helper triggers
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500 selection:text-white">
        
        {/* Navigation bar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home showToast={showToast} />} />
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard showToast={showToast} />
                </ProtectedRoute>
              } 
            />
            {/* Fallback path redirects back to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Floating Toast Notifications Container */}
        <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
          {toasts.map((toast) => {
            // Pick styling and icon depending on type
            let bgStyle = 'bg-slate-900 border-slate-800 text-slate-200';
            let icon = <Info size={18} className="text-blue-400" />;

            if (toast.type === 'success') {
              bgStyle = 'bg-emerald-950/90 border-emerald-500/20 text-emerald-300';
              icon = <CheckCircle2 size={18} className="text-emerald-400" />;
            } else if (toast.type === 'error') {
              bgStyle = 'bg-red-950/90 border-red-500/20 text-red-300';
              icon = <AlertCircle size={18} className="text-red-400" />;
            } else if (toast.type === 'info') {
              bgStyle = 'bg-blue-950/90 border-blue-500/20 text-blue-300';
              icon = <Info size={18} className="text-blue-400" />;
            }

            return (
              <div
                key={toast.id}
                className={`flex items-start justify-between gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto transform transition-all duration-300 animate-slide-down ${bgStyle}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{icon}</div>
                  <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-white transition-colors flex-shrink-0 mt-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </Router>
  );
}

export default App;
