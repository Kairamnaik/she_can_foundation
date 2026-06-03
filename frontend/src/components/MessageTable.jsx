import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, ChevronLeft, ChevronRight, Inbox, Mail } from 'lucide-react';

const MessageTable = ({ messages, onViewDetails, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter messages based on search term (name or email)
  const filteredMessages = messages.filter((msg) => {
    const term = searchTerm.toLowerCase();
    return (
      (msg.name && msg.name.toLowerCase().includes(term)) ||
      (msg.email && msg.email.toLowerCase().includes(term))
    );
  });

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination details
  const totalItems = filteredMessages.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  // Date formatting utility
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl form-input-premium text-sm"
          />
        </div>
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Found {totalItems} {totalItems === 1 ? 'Message' : 'Messages'}
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="dashboard-table min-w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-300 font-semibold">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-slate-900/20 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6 font-medium text-white">{msg.name}</td>
                    {/* Email */}
                    <td className="py-4 px-6 text-slate-300">
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center space-x-1.5 hover:text-primary-400 transition-colors group"
                      >
                        <Mail size={14} className="text-slate-500 group-hover:text-primary-400" />
                        <span>{msg.email}</span>
                      </a>
                    </td>
                    {/* Message Preview */}
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                      {msg.message}
                    </td>
                    {/* Date */}
                    <td className="py-4 px-6 text-slate-400 text-xs">{formatDate(msg.createdAt)}</td>
                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          onClick={() => onViewDetails(msg)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 transition-colors cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(msg._id)}
                          title="Delete Message"
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Inbox size={40} className="text-slate-600" />
                      <span className="text-base font-medium">No contact messages found</span>
                      <span className="text-xs text-slate-600">Submissions will show up here</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalItems > 0 && (
          <div className="px-6 py-4 bg-slate-900/25 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
            <div className="text-xs text-slate-400">
              Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-white">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{' '}
              of <span className="font-semibold text-white">{totalItems}</span> submissions
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-800 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="text-xs font-medium text-slate-300 px-2">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:hover:text-slate-400 disabled:hover:border-slate-800 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageTable;
