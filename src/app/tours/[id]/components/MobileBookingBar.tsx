import React from 'react';
import { useRouter } from 'next/navigation';

interface MobileBookingBarProps {
  tourDetails: any;
}

const MobileBookingBar: React.FC<MobileBookingBarProps> = ({ tourDetails }) => {
  const router = useRouter();
  
  const handleBookNow = () => {
    if (tourDetails?.id) {
      router.push(`/tours/${tourDetails.id}/booking`);
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-orange-500">
              ₹{tourDetails?.price ? parseInt(tourDetails.price).toLocaleString() : '0'}
            </span>
            <span className="ml-2 text-sm text-gray-500">per person</span>
          </div>
          <button 
            onClick={handleBookNow}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBookingBar;
