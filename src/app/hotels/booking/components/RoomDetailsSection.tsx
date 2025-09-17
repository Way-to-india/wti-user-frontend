import { useTheme } from '@/context/ThemeContext';
import { RoomDetails } from '@/types/booking';
import { RoomCard } from './RoomCard';

interface RoomDetailsSectionProps {
  selectedRooms: { [key: string]: RoomDetails } | null;
  numberOfNights: number;
  onRoomOperation: (roomType: string, operation: 'increment' | 'decrement' | 'delete') => void;
  onShowAmenities: (roomType: string, amenities: string[]) => void;
}

export const RoomDetailsSection: React.FC<RoomDetailsSectionProps> = ({
  selectedRooms,
  numberOfNights,
  onRoomOperation,
  onShowAmenities,
}) => {
  const theme = useTheme();

  if (!selectedRooms || Object.keys(selectedRooms).length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <h2
        className="text-lg font-semibold mb-4"
        style={{
          color: theme.colors.heavyMetal,
          fontFamily: theme.typography.fontFamily.bold,
        }}
      >
        Room Details
      </h2>
      <div className="space-y-4">
        {Object.entries(selectedRooms).map(([roomType, details]) => (
          <RoomCard
            key={roomType}
            roomType={roomType}
            details={details}
            numberOfNights={numberOfNights}
            onIncrement={() => onRoomOperation(roomType, 'increment')}
            onDecrement={() => onRoomOperation(roomType, 'decrement')}
            onRemove={() => onRoomOperation(roomType, 'delete')}
            onShowAmenities={() => onShowAmenities(roomType, details.amenities || [])}
          />
        ))}
      </div>
    </div>
  );
};
