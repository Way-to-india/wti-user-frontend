import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

interface TourSidebarProps {
  tourDetails: any;
  onEnquireClick?: () => void;
}

const TourSidebar: React.FC<TourSidebarProps> = ({ tourDetails }) => {
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
          onClick={handleWhatsAppRedirect}
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

        {/* Contact Us */}
        <button
          className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm hover:bg-orange-50"
          style={{
            borderColor: theme.colors.carrotOrange,
            color: theme.colors.carrotOrange,
            fontFamily: theme.typography.fontFamily.bold,
          }}
          onClick={handleWhatsAppRedirect}
        >
          Contact Us
        </button>
      </div>
    </>
  );
};

export default TourSidebar;
