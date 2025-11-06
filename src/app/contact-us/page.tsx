'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Sparkles, ArrowRight, Star } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ApiError {
  message: string;
  statusCode: number;
}


const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/assets/images/logo1.png"
              width={200}
              height={60}
              alt="Way to India Logo"
              className="w-40 sm:w-48 md:w-52 h-auto cursor-pointer transition-transform hover:scale-105"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">
              Home
            </Link>
            <Link href="/tours" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">
              Tours
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">
              Hotels
            </Link>
            <Link href="/transport" className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105">
              Transport
            </Link>
            <Link href="/contact" className="relative text-orange-600 font-bold">
              Contact
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" />
            </Link>
          </div>

          <div className="hidden md:block">
            <Link href="/tours">
              <button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Book Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


const HeroSection = () => {
  return (
    <div className="relative py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 px-5 py-2 rounded-full mb-8 animate-bounce">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold text-orange-600">We're Here to Help 24/7</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 bg-gradient-to-r from-gray-900 via-orange-600 to-gray-900 bg-clip-text text-transparent leading-tight animate-fade-in">
          Let's Connect
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
          Your next adventure is just a message away. Our travel experts are ready to craft your perfect journey.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="group cursor-pointer">
            <div className="text-4xl font-black text-orange-600 mb-1 group-hover:scale-110 transition-transform">10K+</div>
            <div className="text-sm text-gray-600 font-medium">Happy Travelers</div>
          </div>
          <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <div className="group cursor-pointer">
            <div className="text-4xl font-black text-orange-600 mb-1 group-hover:scale-110 transition-transform">24/7</div>
            <div className="text-sm text-gray-600 font-medium">Customer Support</div>
          </div>
          <div className="hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
          <div className="group cursor-pointer">
            <div className="text-4xl font-black text-orange-600 mb-1 group-hover:scale-110 transition-transform">4.9★</div>
            <div className="text-sm text-gray-600 font-medium">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ContactInfoCards = () => {
  return (
    <div className="lg:col-span-1 space-y-6">

      <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:border-orange-200">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-lg">
              <Phone className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-2">Call Us</h3>
            <p className="text-sm text-gray-600 mb-3">Available Mon-Sat, 9 AM - 8 PM</p>
            <div className="space-y-2">
              <a href="tel:+911234567890" className="block text-orange-600 font-bold hover:text-orange-700 transition-colors text-lg">
                +91 8527255995
              </a>
              <a href="tel:+911234567891" className="block text-orange-600 font-bold hover:text-orange-700 transition-colors text-lg">
                +91 8527255995
              </a>
            </div>
          </div>
        </div>
      </div>


      <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:border-orange-200">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-gray-900 mb-2">Email Us</h3>
            <p className="text-sm text-gray-600 mb-3">Reply within 24 hours</p>
            <div className="space-y-2">
              <a href="mailto:info@waytoindia.com" className="block text-blue-600 font-bold hover:text-blue-700 break-all transition-colors">
                info@waytoindia.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-white">
        <div className="flex items-start gap-4">
          <Clock className="w-8 h-8 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-black mb-4">Business Hours</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="font-semibold">Mon - Fri</span>
                <span className="font-bold">9 AM - 8 PM</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="font-semibold">Saturday</span>
                <span className="font-bold">10 AM - 6 PM</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <span className="font-semibold">Sunday</span>
                <span className="font-bold">Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-xl text-white">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Follow Our Journey
        </h3>
        <div className="flex gap-3">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-orange-500 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-pink-500 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-blue-400 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-blue-600 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:rotate-6">
            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};


const ContactForm = ({ formData, handleChange, isSubmitting, submitted, handleSubmit }: any) => {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 flex items-center gap-3">
            <MessageCircle className="w-10 h-10 text-orange-600" />
            Drop us a line
          </h2>
          <p className="text-gray-600 text-lg">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full mb-6 shadow-2xl animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">Message Sent! 🎉</h3>
            <p className="text-gray-600 text-lg">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-black text-gray-700 mb-3">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 font-semibold bg-white group-hover:border-gray-300"
                  placeholder="Rajesh Kumar"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-black text-gray-700 mb-3">
                  Email Address <span className="text-orange-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 font-semibold bg-white group-hover:border-gray-300"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-black text-gray-700 mb-3">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 font-semibold bg-white group-hover:border-gray-300"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-black text-gray-700 mb-3">
                  Subject <span className="text-orange-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none bg-white text-gray-900 font-semibold group-hover:border-gray-300"
                >
                  <option value="">Choose a topic</option>
                  <option value="tour">🏖️ Tour Packages</option>
                  <option value="hotel">🏨 Hotel Booking</option>
                  <option value="transport">🚗 Transport Services</option>
                  <option value="general">💬 General Inquiry</option>
                  <option value="feedback">⭐ Feedback</option>
                  <option value="complaint">⚠️ Complaint</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-black text-gray-700 mb-3">
                Your Message <span className="text-orange-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none text-gray-900 font-semibold bg-white group-hover:border-gray-300"
                placeholder="Tell us about your travel plans, questions, or how we can help you..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-full shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 hover:shadow-orange-500/50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>


      <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-6 h-6 text-orange-600" />
          Quick Answers
        </h3>
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <p className="font-black text-orange-600 mb-2">⚡ How fast do you respond?</p>
            <p className="text-gray-700 font-medium">Within 24 hours on business days. Urgent? Call us directly!</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <p className="font-black text-orange-600 mb-2">🔄 Can I change my booking?</p>
            <p className="text-gray-700 font-medium">Absolutely! Share your booking ID and we'll help you modify it.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <p className="font-black text-orange-600 mb-2">👥 Group discounts available?</p>
            <p className="text-gray-700 font-medium">Yes! Special rates for groups of 10+ travelers. Let's talk!</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <Image
            src="/assets/images/logo1.png"
            width={200}
            height={60}
            alt="Way to India Logo"
            className="w-48 h-auto mx-auto mb-6 brightness-0 invert"
          />
          <p className="text-gray-400 mb-6 text-lg font-medium">Making your travel dreams come true since 2010</p>
          <div className="flex items-center justify-center gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
            ))}
          </div>
          <p className="text-sm text-gray-500">© 2025 Way to India. All rights reserved. | Built with ❤️ for travelers</p>
        </div>
      </div>
    </footer>
  );
};


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/user/contact-us-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.toLowerCase(),
        message: formData.message.trim()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    // Success
    // setSuccessMessage(data.message || "Your message has been sent successfully!");
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={{
            left: `${mousePosition.x / 30}px`,
            top: `${mousePosition.y / 30}px`,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Navigation />
      <HeroSection />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ContactInfoCards />
          <ContactForm
            formData={formData}
            handleChange={handleChange}
            isSubmitting={isSubmitting}
            submitted={submitted}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;