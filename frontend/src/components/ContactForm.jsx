import React, { useState } from 'react';
import { Send, CheckCircle2, User, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { contactService } from '../services/api';

const ContactForm = ({ showToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on type if touched
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    // Validate all fields
    const formErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };

    setErrors(formErrors);

    // Check if there are any errors
    const hasErrors = Object.values(formErrors).some((error) => error !== '');
    if (hasErrors) {
      showToast('Please correct the errors in the form', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await contactService.submitForm(formData);
      if (response.success) {
        setIsSubmitted(true);
        showToast('Form Submitted Successfully!', 'success');
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
        setTouched({});
      } else {
        showToast(response.message || 'Submission failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      const backendError = error.response?.data?.message || 'Server error, please try again later.';
      showToast(backendError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="glass-panel p-8 md:p-12 rounded-3xl text-center max-w-lg mx-auto border border-emerald-500/20 shadow-xl shadow-emerald-950/10 animate-slide-up">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-400 border border-emerald-500/20 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your contact form has been submitted successfully. The team at She Can Foundation will review your message and get back to you shortly.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="w-full py-3.5 px-6 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white transition-all duration-300 shadow-md shadow-primary-500/20 cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-3xl max-w-xl mx-auto border border-white/5 shadow-2xl relative overflow-hidden animate-slide-up">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-500 via-accent-500 to-amber-500"></div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Send us a Message</h3>
        <p className="text-slate-400 text-sm">Have queries or want to volunteer? We'd love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={18} />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Emma Watson"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 rounded-xl form-input-premium ${
                errors.name && touched.name ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20' : ''
              }`}
            />
          </div>
          {errors.name && touched.name && (
            <div className="flex items-center space-x-1 text-red-400 text-xs mt-1">
              <AlertCircle size={14} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="emma@example.com"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 rounded-xl form-input-premium ${
                errors.email && touched.email ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20' : ''
              }`}
            />
          </div>
          {errors.email && touched.email && (
            <div className="flex items-center space-x-1 text-red-400 text-xs mt-1">
              <AlertCircle size={14} />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-semibold text-slate-300 tracking-wider uppercase block">
            Your Message
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 flex items-start pointer-events-none text-slate-400">
              <MessageSquare size={18} />
            </div>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Write your message here... (minimum 10 characters)"
              disabled={isLoading}
              className={`w-full pl-10 pr-4 py-3 rounded-xl form-input-premium resize-none ${
                errors.message && touched.message ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20' : ''
              }`}
            />
          </div>
          {errors.message && touched.message && (
            <div className="flex items-center space-x-1 text-red-400 text-xs mt-1">
              <AlertCircle size={14} />
              <span>{errors.message}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 disabled:hover:from-primary-600 disabled:hover:to-accent-600 disabled:cursor-not-allowed text-white shadow-lg shadow-primary-500/10 hover:shadow-primary-500/25 transition-all duration-300 cursor-pointer"
        >
          {isLoading ? (
            <div className="spinner-premium border-2 border-t-white"></div>
          ) : (
            <>
              <span>Submit Message</span>
              <Send size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
