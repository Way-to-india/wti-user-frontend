'use client';

import React, { useState } from 'react';
import Modal from '@/lib/modals/modals';
import { IoArrowBack } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';

interface EnquireNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourName: string;
  tourCategory?: string;
  tourImage?: string;
  tourRating?: number;
}

const EnquireNowModal = ({
  isOpen,
  onClose,
  tourName,
  tourCategory = "Trekking Tours In India",
  tourImage = "/assets/images/tours/valley-of-flowers.jpg",
  tourRating = 4.5
}: EnquireNowModalProps) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    numberOfPeople: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Import the submission service
      const { submitTourEnquiry } = await import('@/services/enquiryService');
      
      // Get the tour ID from the URL
      const pathname = window.location.pathname;
      const tourId = pathname.split('/').pop() || '';
      
      // Submit the enquiry
      await submitTourEnquiry({
        tourId,
        tourName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        numberOfPeople: parseInt(formData.numberOfPeople),
        message: formData.message
      });
      
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          email: '',
          phoneNumber: '',
          numberOfPeople: '',
          message: ''
        });
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal modalOpen={isOpen} handleClose={onClose} className="p-6" drawer>
      <div className="border-b pb-4 mb-4 relative">
        <button 
          onClick={onClose}
          className="absolute left-0 top-0 p-2"
        >
          <IoArrowBack size={20} />
        </button>
        <h3 className="text-center font-medium text-lg">
          ENQUIRY FORM
        </h3>
      </div>
        
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-[#FF8B02]">{tourName}</h2>
          <div className="flex items-center mt-1">
            <span className="bg-[#FFF2E1] text-[#FF8B02] text-xs rounded-full px-3 py-1">
              {tourCategory}
            </span>
            <div className="flex items-center ml-3">
              <FaStar className="text-[#FF8B02] mr-1" size={14} />
              <span className="text-sm font-medium">{tourRating} Ratings</span>
            </div>
          </div>
          
          <div className="mt-4 mb-6">
            <div className="rounded-md overflow-hidden w-full h-48 relative">
              <Image 
                src={tourImage} 
                alt={tourName}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber" className="block mb-1 font-medium text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-100 rounded-md"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="numberOfPeople" className="block mb-1 font-medium text-sm">
                    Number of People
                  </label>
                  <input
                    type="number"
                    id="numberOfPeople"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-3 bg-gray-100 rounded-md"
                    placeholder="Enter number of people"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-1 font-medium text-sm">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-100 rounded-md"
                  placeholder="Enter your message"
                  required
                ></textarea>
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                Reply expected within 30-45 minutes during business hours (9 AM - 7 PM)
              </div>
              
              <button
                type="submit"
                className={`w-full bg-[#FF8B02] text-white py-3 rounded-md font-medium hover:bg-[#e07a00] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit"}
              </button>
            </div>
          </form>
        </div>
    </Modal>
  );
};

export default EnquireNowModal;
