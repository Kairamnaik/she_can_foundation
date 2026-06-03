import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MessageSquare, Calendar, RefreshCw, LogOut, 
  X, User, Mail, Clock, AlertTriangle, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import { contactService, authService } from '../services/api';
import MessageTable from '../components/MessageTable';

const Dashboard = ({ showToast }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  const navigate = useNavigate();

  // Load message data
  const fetchMessages = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const response = await contactService.getAll();
      if (response.success) {
        setMessages(response.data);
      } else {
        setError(response.message || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.response?.data?.message || 'Failed to fetch messages from server.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleLogout = () => {
    authService.logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  // Stats calculators
  const totalMessagesCount = messages.length;
  
  const messagesTodayCount = messages.filter((msg) => {
    const today = new Date();
    const msgDate = new Date(msg.createdAt);
    return (
      msgDate.getDate() === today.getDate() &&
      msgDate.getMonth() === today.getMonth() &&
      msgDate.getFullYear() === today.getFullYear()
    );
  }).length;

  // View details modal trigger
  const handleOpenDetails = (msg) => {
    setSelectedMessage(msg);
  };

  // Delete message confirmation trigger
  const handleDeleteRequest = (id) => {
    setDeleteTargetId(id);
  };

  // Execute deletion
  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const response = await contactService.delete(deleteTargetId);
      if (response.success) {
        showToast('Message deleted successfully', 'success');
        setMessages((prev) => prev.filter((m) => m._id !== deleteTargetId));
        
        // Close details modal if the active message was just deleted
        if (selectedMessage && selectedMessage._id === deleteTargetId) {
          setSelectedMessage(null);
        }
      } else {
        showToast(response.message || 'Delete operation failed', 'error');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err.response?.data?.message || 'Could not delete contact message.', 'error');
    } finally {
      setDeleteTargetId(null);
    }
  };

  // Utility to format date
  const formatFullDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background decorations */}
      <div className="mesh-bg">
        <div className="mesh-glow-1"></div>
        <div className="mesh-glow-2"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
        {/* Dashboard Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-white/5 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20 text-primary-400">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Admin Control Room
                <span className="flex items-center text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                  <ShieldCheck size={12} className="mr-1" /> Authorized
                </span>
              </h2>
              <p className="text-slate-400 text-sm">Monitor, inspect, and manage community contact requests.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => fetchMessages(false)}
              disabled={loading}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>

        {/* Analytics Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1: Total Messages */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-primary-500/5 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare size={120} />
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Total Submissions</span>
              {loading ? (
                <div className="h-10 w-24 bg-slate-800/50 animate-pulse rounded-md mt-1"></div>
              ) : (
                <span className="text-4xl font-extrabold text-white block">{totalMessagesCount}</span>
              )}
              <span className="text-[10px] text-slate-500 flex items-center mt-1">
                Since database inception <ArrowUpRight size={10} className="ml-0.5" />
              </span>
            </div>
            <div className="bg-primary-500/10 p-4 rounded-xl border border-primary-500/20 text-primary-400">
              <MessageSquare size={24} />
            </div>
          </div>

          {/* Card 2: Received Today */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 text-accent-500/5 group-hover:scale-110 transition-transform duration-300">
              <Calendar size={120} />
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block">Messages Today</span>
              {loading ? (
                <div className="h-10 w-24 bg-slate-800/50 animate-pulse rounded-md mt-1"></div>
              ) : (
                <span className="text-4xl font-extrabold text-white block">{messagesTodayCount}</span>
              )}
              <span className="text-[10px] text-slate-500 flex items-center mt-1">
                Resetting at midnight UTC <ArrowUpRight size={10} className="ml-0.5" />
              </span>
            </div>
            <div className="bg-accent-500/10 p-4 rounded-xl border border-accent-500/20 text-accent-400">
              <Calendar size={24} />
            </div>
          </div>
        </div>

        {/* MessageTable Section */}
        {error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex flex-col items-center text-center space-y-3">
            <AlertTriangle size={32} />
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchMessages(false)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <div className="glass-panel p-20 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-4">
            <div className="spinner-premium"></div>
            <span className="text-slate-400 text-sm font-medium">Retrieving contact submissions...</span>
          </div>
        ) : (
          <MessageTable 
            messages={messages} 
            onViewDetails={handleOpenDetails}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>

      {/* Modal 1: Message Details Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 to-accent-500"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Submission Details</h3>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-slate-950 p-2 rounded-lg text-slate-400 border border-slate-800">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Sender Name</span>
                    <span className="text-sm font-semibold text-white">{selectedMessage.name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className="bg-slate-950 p-2 rounded-lg text-slate-400 border border-slate-800">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-sm font-semibold text-primary-400 hover:underline break-all">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="bg-slate-950 p-2 rounded-lg text-slate-400 border border-slate-800">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Submitted At</span>
                  <span className="text-sm text-slate-300">{formatFullDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              {/* Message text block */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Full Message</span>
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-900 text-slate-350 text-sm leading-relaxed overflow-y-auto max-h-48 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900/25 border-t border-white/5 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 border border-slate-800 hover:border-slate-700 bg-slate-900/60 rounded-xl transition-all cursor-pointer"
              >
                Close View
              </button>
              <button
                onClick={() => {
                  handleDeleteRequest(selectedMessage._id);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all cursor-pointer"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Delete Confirmation Dialog */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-sm w-full rounded-2xl border border-red-500/20 shadow-2xl relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600"></div>

            <div className="p-6 text-center space-y-4">
              <div className="mx-auto bg-red-500/10 p-3 rounded-full text-red-500 border border-red-500/20 w-fit">
                <AlertTriangle size={32} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Delete Message</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Are you sure you want to permanently delete this submission? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900/25 border-t border-white/5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-400 border border-slate-800 hover:border-slate-700 bg-slate-900/60 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
