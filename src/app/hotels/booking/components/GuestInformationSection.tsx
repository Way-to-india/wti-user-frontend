import { useTheme } from '@/context/ThemeContext';
import { GuestInformation, RoomDetails } from '@/types/booking';
import GuestInformationForm from '@/components/booking/GuestInformationForm';

interface GuestInformationSectionProps {
  guestInfo: GuestInformation[];
  selectedRooms: { [key: string]: RoomDetails } | null;
  totalGuests: number;
  onGuestInfoChange: (index: number, field: keyof GuestInformation, value: string) => void;
  onAddGuest: () => void;
  onRemoveGuest: (index: number) => void;
}

export const GuestInformationSection: React.FC<GuestInformationSectionProps> = ({
  guestInfo,
  selectedRooms,
  totalGuests,
  onGuestInfoChange,
  onAddGuest,
  onRemoveGuest,
}) => {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <h2
          className="text-lg font-semibold"
          style={{
            color: theme.colors.heavyMetal,
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          Guest Information
        </h2>
        {guestInfo.length < totalGuests && (
          <button
            onClick={onAddGuest}
            className="text-sm bg-[#FF8B02] text-white px-4 py-2 rounded-lg hover:bg-[#E67E02] transition-colors self-start sm:self-auto"
            style={{
              fontFamily: theme.typography.fontFamily.regular,
            }}
          >
            Add Guest
          </button>
        )}
      </div>
      <div className="space-y-4">
        {guestInfo.map((guest, index) => (
          <GuestInformationForm
            key={index}
            guestNumber={index + 1}
            guestInfo={guest}
            onChange={(field, value) =>
              onGuestInfoChange(index, field as keyof GuestInformation, value)
            }
            isPrimary={index === 0}
            isRemovable={index !== 0}
            onRemove={
              index !== 0
                ? () => {
                    const minGuests = selectedRooms
                      ? Object.values(selectedRooms).reduce((total, room) => total + room.count, 0)
                      : 1;

                    if (guestInfo.length > minGuests) {
                      onRemoveGuest(index);
                    } else {
                      alert('Cannot remove guest. You need at least one guest per room booked.');
                    }
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
