'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/lib/modals/modals';
import { IoArrowBack, IoCheckmarkCircle } from 'react-icons/io5';
import { FaStar, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Script from 'next/script';
import apiClient, { endpoints } from '@/api/axios';
import { submitTourEnquiry } from '@/services/enquiryService';

interface EnquireNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  tourCategory?: string;
  tourImage?: string;
  tourRating?: number;
}

interface User {
  id: string;
  title: 'mr' | 'ms' | 'mrs' | 'none';
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  profileImagePath: string;
  pincode: number;
  bio: string;
  isPhoneVerified: boolean;
  role: string;
}

// Extend Window interface for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, parameters: {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        theme?: 'light' | 'dark';
        size?: 'normal' | 'compact';
      }) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
    };
  }
}

const EnquireNowModal = ({
  isOpen,
  onClose,
  tourName,
  tourCategory = 'Trekking Tours In India',
  tourImage = '/assets/images/tours/valley-of-flowers.jpg',
  tourRating = 4.5,
}: EnquireNowModalProps) => {
  const { colors } = useTheme();

  const [userData, setUserData] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    numberOfPeople: '2',
    travelDate: '',
    departureCity: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);
  
  const YOUR_RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Initialize reCAPTCHA v2
  useEffect(() => {
    if (recaptchaLoaded && isOpen && recaptchaRef.current && !recaptchaWidgetId.current) {
      try {
        recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: YOUR_RECAPTCHA_SITE_KEY!,
          callback: (token: string) => {
            setRecaptchaToken(token);
          },
          'expired-callback': () => {
            setRecaptchaToken('');
          },
          'error-callback': () => {
            setRecaptchaToken('');
            alert('reCAPTCHA error. Please try again.');
          },
          theme: 'light',
          size: 'normal',
        });
      } catch (error) {
        console.error('Error rendering reCAPTCHA:', error);
      }
    }
  }, [recaptchaLoaded, isOpen, YOUR_RECAPTCHA_SITE_KEY]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen) return;
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoadingUser(false);
        return;
      }
      try {
        setLoadingUser(true);
        const response = await apiClient.get(endpoints.user.profile);
        if (response.data.status || response.data.success) {
          const user = response.data.payload || response.data.data;
          setUserData(user);
          setFormData(prev => ({
            ...prev,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: '',
            phoneNumber: user.phone || '',
            departureCity: user.address || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        numberOfPeople: '2',
        travelDate: '',
        departureCity: '',
        specialRequests: '',
      });
      setSubmitSuccess(false);
      setRecaptchaToken('');
      // Reset reCAPTCHA
      if (recaptchaWidgetId.current !== null) {
        try {
          window.grecaptcha.reset(recaptchaWidgetId.current);
        } catch (error) {
          console.error('Error resetting reCAPTCHA:', error);
        }
      }
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification');
      return;
    }

    setIsSubmitting(true);
    try {
      const pathname = window.location.pathname;
      const tourId = pathname.split('/').pop() || '';
      
      await submitTourEnquiry({
        tourId,
        tourName,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        numberOfPeople: parseInt(formData.numberOfPeople),
        travelDate: formData.travelDate,
        departureCity: formData.departureCity.trim(),
        specialRequests: formData.specialRequests.trim(),
        recaptchaToken: recaptchaToken,
      });
      
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
      // Reset reCAPTCHA on error
      if (recaptchaWidgetId.current !== null) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
        setRecaptchaToken('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <Modal modalOpen={isOpen} handleClose={onClose} className="p-6" drawer>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <IoCheckmarkCircle className="text-green-500 text-8xl animate-bounce" />
            <div className="absolute inset-0 bg-green-500 opacity-20 rounded-full animate-ping" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
            Enquiry Submitted Successfully!
          </h3>
          <p className="text-gray-600 text-center max-w-sm">
            Thank you for your interest. Our team will contact you within 30-45 minutes during
            business hours.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        onLoad={() => setRecaptchaLoaded(true)}
        strategy="lazyOnload"
      />

      <Modal modalOpen={isOpen} handleClose={onClose} className="p-0" drawer>
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10 shadow-sm">
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <IoArrowBack size={22} />
          </button>
          <h3 className="text-center font-semibold text-lg text-gray-800">Tour Enquiry Form</h3>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Tour Info Card */}
          <div className="mt-4 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-xl p-4 border border-orange-100 shadow-sm">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                <Image src={tourImage} alt={tourName} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2">{tourName}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center bg-white px-2.5 py-1 rounded-full shadow-sm">
                    <FaStar className="text-orange-500 mr-1" size={12} />
                    <span className="text-xs font-semibold text-gray-800">{tourRating}</span>
                  </div>
                  <span className="text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full shadow-sm line-clamp-1">
                    {tourCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading indicator for user data */}
          {loadingUser && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-blue-700">Loading your information...</p>
            </div>
          )}

          {/* User Info Display (if logged in) */}
          {userData && !loadingUser && (
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Welcome back, {userData.firstName}!
                  </p>
                  <p className="text-xs text-green-700">
                    We've pre-filled your information. Please review and complete the form.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                  1
                </span>
                <h4 className="font-semibold text-gray-800">Personal Information</h4>
              </div>

              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-sm text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-sm text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                    placeholder="your@email.com"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 font-medium text-sm text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                    placeholder="+91 98765 43210"
                    required
                    pattern="[+]?[0-9\s-]{10,15}"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                  2
                </span>
                <h4 className="font-semibold text-gray-800">Travel Details</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="numberOfPeople"
                    className="block mb-2 font-medium text-sm text-gray-700"
                  >
                    <FaUsers className="inline mr-1.5 text-orange-500" />
                    Number of Travelers <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="numberOfPeople"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm cursor-pointer"
                    required
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                    <option value="7">7+ People</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="travelDate"
                    className="block mb-2 font-medium text-sm text-gray-700"
                  >
                    <FaCalendarAlt className="inline mr-1.5 text-orange-500" />
                    Preferred Travel Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="travelDate"
                    name="travelDate"
                    value={formData.travelDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="departureCity"
                  className="block mb-2 font-medium text-sm text-gray-700"
                >
                  <FaMapMarkerAlt className="inline mr-1.5 text-orange-500" />
                  Departure City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="departureCity"
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
                  placeholder="e.g., Delhi, Mumbai, Bangalore"
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                  3
                </span>
                <h4 className="font-semibold text-gray-800">Additional Information</h4>
              </div>

              <div>
                <label
                  htmlFor="specialRequests"
                  className="block mb-2 font-medium text-sm text-gray-700"
                >
                  Special Requests or Questions{' '}
                  <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none text-sm"
                  placeholder="Tell us about any dietary requirements, accessibility needs, preferences, or questions you have about the tour..."
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.specialRequests.length}/500 characters
                </p>
              </div>
            </div>

            {/* reCAPTCHA v2 Checkbox */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <span className="w-7 h-7 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-md">
                  4
                </span>
                <h4 className="font-semibold text-gray-800">Verification</h4>
              </div>

              <div className="flex justify-center">
                <div ref={recaptchaRef} className="flex justify-center items-center min-h-[78px]">
                  {!recaptchaLoaded && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-sm">Loading reCAPTCHA...</span>
                    </div>
                  )}
                </div>
              </div>

              {!recaptchaToken && recaptchaLoaded && (
                <p className="text-xs text-orange-600 text-center">
                  Please complete the reCAPTCHA verification above
                </p>
              )}
            </div>

            {/* Quick Response Info */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <div className="text-2xl mt-0.5">⏱️</div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Quick Response Guarantee</p>
                <p className="text-xs text-blue-700">
                  Our expert team responds within <strong>30-45 minutes</strong> during business
                  hours (9 AM - 7 PM IST, Mon-Sat)
                </p>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                🔒 Your information is secure and protected. This form is protected by Google
                reCAPTCHA to prevent spam and abuse.
              </p>
            </div>

            {/* reCAPTCHA Policy */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !recaptchaLoaded || loadingUser || !recaptchaToken}
              className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold text-base hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${
                isSubmitting ? 'cursor-wait' : ''
              }`}
            >
              {!recaptchaLoaded ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading Security...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting Enquiry...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Submit Enquiry</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default EnquireNowModal;