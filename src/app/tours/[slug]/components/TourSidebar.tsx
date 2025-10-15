import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

interface TourSidebarProps {
  tourDetails: any;
  onEnquireClick?: () => void;
}

const TourSidebar: React.FC<TourSidebarProps> = ({ tourDetails, onEnquireClick }) => {
  const theme = useTheme();
  const router = useRouter();

  const whatsappNumber = '918527255995';

  const handleWhatsAppRedirect = () => {
    const message = `Hello! I'm interested in learning more about the tour: ${
      tourDetails?.title || 'your tour'
    }.`;

    // Create WhatsApp URL with proper encoding
    // Use api.whatsapp.com for better compatibility
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleBookNow = () => {
    if (tourDetails?.id) {
      router.push(`/tours/${tourDetails.id}/booking`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-4 border shadow-sm mb-4">
        {/* Enquire Now */}
        <button
          className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm hover:bg-orange-50"
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
    </>
  );
};

export default TourSidebar;
