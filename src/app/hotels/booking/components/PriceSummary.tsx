import { useTheme } from '@/context/ThemeContext';
import { RoomDetails } from '@/types/booking';
import { useBookingCalculations } from '@/app/hooks/useBookingCalculation'; 

interface PriceSummaryProps {
  selectedRooms: { [key: string]: RoomDetails } | null;
  numberOfNights: number;
  isBooking: boolean;
  onProceedToCheckout: () => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  selectedRooms,
  numberOfNights,
  isBooking,
  onProceedToCheckout,
}) => {
  const theme = useTheme();
  const { totalPrice, taxAmount, totalWithTax, averageTaxRate } = useBookingCalculations(
    selectedRooms,
    numberOfNights
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2
        className="text-lg font-semibold mb-4"
        style={{
          color: theme.colors.heavyMetal,
          fontFamily: theme.typography.fontFamily.bold,
        }}
      >
        Price Summary
      </h2>
      <div className="space-y-4">
        {selectedRooms &&
          Object.entries(selectedRooms).map(([roomType, details]) => (
            <div
              key={roomType}
              className="flex flex-col gap-1 border-b border-gray-100 pb-3"
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {roomType} ({details.count} × {numberOfNights} nights)
                </span>
                <span className="font-medium">
                  ₹{details.price * details.count * numberOfNights}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tax ({details.taxRate !== undefined ? details.taxRate : 10}%)</span>
                <span>
                  ₹
                  {Math.round(
                    details.price *
                      details.count *
                      numberOfNights *
                      ((details.taxRate !== undefined ? details.taxRate : 10) / 100)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span>Total with tax</span>
                <span>
                  ₹
                  {Math.round(
                    details.price *
                      details.count *
                      numberOfNights *
                      (1 + (details.taxRate !== undefined ? details.taxRate : 10) / 100)
                  )}
                </span>
              </div>
            </div>
          ))}

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div
            className="flex justify-between text-sm mb-2"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            <span>Room Charges</span>
            <span>₹{totalPrice}</span>
          </div>
          <div
            className="flex justify-between text-sm mb-3"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            <span>Taxes & Fees ({averageTaxRate}% avg.)</span>
            <span>₹{Math.round(taxAmount)}</span>
          </div>
          <div
            className="flex justify-between font-semibold text-[#FF8B02] text-base sm:text-lg"
            style={{ fontFamily: theme.typography.fontFamily.bold }}
          >
            <span>Total Amount</span>
            <span>₹{Math.round(totalWithTax)}</span>
          </div>
        </div>
        <button
          onClick={onProceedToCheckout}
          disabled={isBooking}
          className={`w-full bg-[#FF8B02] text-white py-3 sm:py-4 rounded-lg font-medium hover:bg-[#E67E02] transition-colors mt-4 text-sm sm:text-base ${
            isBooking ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          style={{
            fontFamily: theme.typography.fontFamily.bold,
          }}
        >
          {isBooking ? 'Processing Booking...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};
