import { useTheme } from '@/context/ThemeContext';

interface AmenitiesModalProps {
  isOpen: boolean;
  roomType: string;
  amenities: string[];
  onClose: () => void;
}

export const AmenitiesModal: React.FC<AmenitiesModalProps> = ({
  isOpen,
  roomType,
  amenities,
  onClose,
}) => {
  const theme = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3
            className="text-lg font-semibold"
            style={{
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.bold,
            }}
          >
            {roomType} Amenities
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border-b border-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-[#FF8B02] flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span style={{ fontFamily: theme.typography.fontFamily.regular }}>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
