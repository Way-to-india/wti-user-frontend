import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface PriceSummaryCardProps {
  selectedRooms: {
    [key: string]: { price: number; count: number; taxRate?: number; priceWithTax?: number };
  };
  calculateTotalPrice: () => number;
  calculateTaxAmount: () => number;
  calculateTotalWithTax: () => number;
  hotelId: string;
  theme: any;
}

const PriceSummaryCard: React.FC<PriceSummaryCardProps> = ({
  selectedRooms,
  calculateTotalPrice,
  calculateTaxAmount,
  calculateTotalWithTax,
  hotelId,
  theme,
}) => {
  const router = useRouter();
  return (
    <div className="w-full md:w-1/4 mt-8 md:mt-0">
      <div className="sticky top-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex flex-col h-full">
          {/* Price Card Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Summary</h3>
            <p className="text-sm font-medium text-gray-700">Selected Rooms</p>
            <p className="text-xs text-gray-500">Estimated for entire stay</p>
          </div>

          {/* Total Price Card Body */}
          <div className="p-4">
            <div className="text-sm font-semibold text-gray-500 mb-3">TOTAL PRICE</div>
            <p
              className="text-2xl font-bold mb-1"
              style={{
                color: theme.colors.carrotOrange,
                fontFamily: theme.typography.fontFamily.bold,
              }}
            >
              ₹{calculateTotalPrice()}
            </p>
            <p
              className="text-sm font-medium"
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              for selected rooms
            </p>

            {/* Display estimated taxes */}
            {Object.keys(selectedRooms).length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 flex justify-between">
                  <span>Estimated taxes & fees:</span>
                  <span className="font-medium">+₹{calculateTaxAmount().toFixed(2)}</span>
                </p>
                <p
                  className="text-sm font-medium mt-1 flex justify-between"
                  style={{ color: theme.colors.carrotOrange }}
                >
                  <span>Total with taxes:</span>
                  <span>₹{calculateTotalWithTax().toFixed(2)}</span>
                </p>
              </div>
            )}

            <div className="border-t border-gray-200 mt-2 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 font-medium">ROOMS</label>
                  <div className="relative">
                    <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm">
                      {Object.values(selectedRooms).reduce(
                        (total, roomSelection) => total + roomSelection.count,
                        0
                      ) || 0}{' '}
                      Room(s) Selected
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Rooms Summary */}
              <div className="space-y-2">
                {Object.entries(selectedRooms).map(([roomType, details]) => (
                  <div key={roomType} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{roomType}</span>
                    <span className="font-medium">x{details.count}</span>
                  </div>
                ))}
              </div>

              {Object.keys(selectedRooms).length > 0 && (
                <Button
                  variant="contained"
                  fullWidth
                  className="mt-4"
                  sx={{
                    bgcolor: theme.colors.carrotOrange,
                    fontFamily: theme.typography.fontFamily.bold,
                    '&:hover': {
                      bgcolor: '#E67E02',
                    },
                  }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('selectedRooms', JSON.stringify(selectedRooms));
                      localStorage.setItem('selectedHotelId', hotelId);
                      localStorage.setItem(
                        'bookingTaxInfo',
                        JSON.stringify({
                          taxAmount: calculateTaxAmount(),
                          totalWithTax: calculateTotalWithTax(),
                        })
                      );
                      router.push('/hotels/booking');
                    }
                  }}
                >
                  Proceed to Book
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSummaryCard;
