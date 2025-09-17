import { useTheme } from '@/context/ThemeContext';
import { addDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateSelectionProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  onCheckInChange: (date: Date | null) => void;
  onCheckOutChange: (date: Date | null) => void;
}

export const DateSelection: React.FC<DateSelectionProps> = ({
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange,
}) => {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <h2
        className="text-lg font-semibold mb-4"
        style={{
          color: theme.colors.heavyMetal,
          fontFamily: theme.typography.fontFamily.bold,
        }}
      >
        Select Dates
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            className="text-sm text-gray-600 mb-2 block"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            Check-in
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={onCheckInChange}
            minDate={new Date()}
            placeholderText="Select check-in date"
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
            wrapperClassName="react-datepicker__wrapper w-full"
          />
        </div>
        <div>
          <label
            className="text-sm text-gray-600 mb-2 block"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            Check-out
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={onCheckOutChange}
            minDate={checkInDate ? addDays(checkInDate, 1) : new Date()}
            placeholderText="Select check-out date"
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
            wrapperClassName="react-datepicker__wrapper w-full"
          />
        </div>
      </div>
    </div>
  );
};
