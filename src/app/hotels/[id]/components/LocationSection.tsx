import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { Hotel } from '@/types/hotel';

interface LocationSectionProps {
  hotel: Hotel;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ hotel }) => {
  return (
    <div className="mt-12 pb-8 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Location</h2>

      {/* Key landmarks */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Key Landmarks</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-start gap-2">
            <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">•</span>
            <span className="text-gray-700">Ram Jhula (2.3 km)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">•</span>
            <span className="text-gray-700">Laxman Jhula (3.1 km)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">•</span>
            <span className="text-gray-700">Triveni Ghat (1.5 km)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">•</span>
            <span className="text-gray-700">Parmarth Niketan (2.0 km)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">•</span>
            <span className="text-gray-700">Neelkanth Mahadev (25 km)</span>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {hotel?.location?.latitude && hotel?.location?.longitude ? (
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${hotel.location.longitude}!3d${hotel.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU4JzM0LjUiTiA4McKwMjYnMDcuMSJF!5e0!3m2!1sen!2sin!4v1651234567890!5m2!1sen!2sin`}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hotel Location Map"
          />
        ) : (
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.679887290066!2d78.26712281492047!3d30.1207903217773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909173705d25cbb%3A0xe0b9f0651edcacf2!2sRishikesh%2C%20Uttarakhand%2C%20India!5e0!3m2!1sen!2sus!4v1621505126389!5m2!1sen!2sus"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hotel Location Map"
          />
        )}
      </div>

      {/* Hotel Address */}
      <div className="mt-4 flex items-center gap-2 text-gray-700">
        <FiMapPin className="text-[#FF8B02]" />
        <p>
          {hotel?.location?.address?.addressLine1 ||
            'National Highway 58, Rishikesh, Uttarakhand, India'}
        </p>
      </div>
    </div>
  );
};
