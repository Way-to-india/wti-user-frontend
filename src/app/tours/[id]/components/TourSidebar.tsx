import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TourSidebarProps {
  tourDetails: any;
  onEnquireClick: () => void;
}

const TourSidebar: React.FC<TourSidebarProps> = ({ tourDetails, onEnquireClick }) => {
  const theme = useTheme();

  return (
    <>
      <div className="bg-white rounded-lg p-4 border shadow-sm mb-4 mt-[147px]">
        <h3
          className="text-sm font-medium p-4 -mt-4 -mx-4 mb-4 border-b"
          style={{
            color: theme.colors.heavyMetal,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          TRIP PRICE
        </h3>
        <div className="flex items-baseline mb-1">
          <span className="text-2xl font-bold" style={{ color: theme.colors.carrotOrange }}>
            ₹{tourDetails?.price ? parseInt(tourDetails.price).toLocaleString() : '0'}
          </span>
          <span className="ml-2 text-xs" style={{ color: theme.colors.heavyMetal + '80' }}>
            per person
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: theme.colors.heavyMetal + '80' }}>
          *Excluding applicable taxes
        </p>
        <button
          className="w-full py-2.5 rounded-lg font-medium transition-colors mb-3 text-sm"
          style={{
            backgroundColor: theme.colors.carrotOrange,
            color: theme.colors.milkWhite,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          Book Now
        </button>
        <button
          className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm"
          style={{
            borderColor: theme.colors.carrotOrange,
            color: theme.colors.carrotOrange,
            fontFamily: theme.typography.fontFamily.bold,
          }}
          onClick={onEnquireClick}
        >
          Enquire Now
        </button>
      </div>
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <h3
          className="text-sm font-medium p-4 -mt-4 -mx-4 mb-4 border-b"
          style={{
            color: theme.colors.heavyMetal,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          HAVE QUESTIONS?
        </h3>
        <p className="text-xs mb-4" style={{ color: theme.colors.heavyMetal + '80' }}>
          Don't worry, our team is there to help you out
        </p>
        <button
          className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm"
          style={{
            borderColor: theme.colors.carrotOrange,
            color: theme.colors.carrotOrange,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          Contact Us
        </button>
      </div>
    </>
  );
};

export default TourSidebar;
