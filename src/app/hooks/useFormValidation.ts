import { useCallback, useState } from 'react';
import { GuestInformation } from '../../components/booking/GuestInformationForm';

interface FormState {
  guestInfo: GuestInformation[];
  dateRange: {
    checkIn: string;
    checkOut: string;
  };
  totalAmount: number;
  roomType: string;
}

interface ValidationErrors {
  guestInfo?: Record<number, Record<string, string>>;
  dates?: {
    checkIn?: string;
    checkOut?: string;
  };
  general?: string[];
}

export const useFormValidation = (initialState: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateGuestInfo = useCallback((guestInfo: GuestInformation[]) => {
    const newErrors: Record<number, Record<string, string>> = {};
    let isValid = true;

    guestInfo.forEach((guest, index) => {
      const guestErrors: Record<string, string> = {};

      // Required fields validation
      ['title', 'firstName', 'lastName'].forEach(field => {
        if (!guest[field as keyof GuestInformation]) {
          guestErrors[field] = 'This field is required';
          isValid = false;
        }
      });

      // Primary guest additional validations
      if (index === 0) {
        // Email validation
        if (!guest.email) {
          guestErrors.email = 'Email is required';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) {
          guestErrors.email = 'Please enter a valid email address';
          isValid = false;
        }

        // Phone validation
        if (!guest.phone) {
          guestErrors.phone = 'Phone number is required';
          isValid = false;
        } else if (!/^\+?[\d\s-]{10,}$/.test(guest.phone)) {
          guestErrors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
      }

      if (Object.keys(guestErrors).length > 0) {
        newErrors[index] = guestErrors;
      }
    });

    return { isValid, errors: newErrors };
  }, []);

  const validateDates = useCallback((checkIn: string, checkOut: string) => {
    const dateErrors: { checkIn?: string; checkOut?: string } = {};
    let isValid = true;

    if (!checkIn) {
      dateErrors.checkIn = 'Check-in date is required';
      isValid = false;
    }

    if (!checkOut) {
      dateErrors.checkOut = 'Check-out date is required';
      isValid = false;
    }

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        dateErrors.checkIn = 'Check-in date cannot be in the past';
        isValid = false;
      }

      if (checkOutDate <= checkInDate) {
        dateErrors.checkOut = 'Check-out date must be after check-in date';
        isValid = false;
      }
    }

    return { isValid, errors: dateErrors };
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate guest information
    const guestValidation = validateGuestInfo(formState.guestInfo);
    if (!guestValidation.isValid) {
      newErrors.guestInfo = guestValidation.errors;
      isValid = false;
    }

    // Validate dates
    const dateValidation = validateDates(formState.dateRange.checkIn, formState.dateRange.checkOut);
    if (!dateValidation.isValid) {
      newErrors.dates = dateValidation.errors;
      isValid = false;
    }

    // Validate room type and total amount
    if (!formState.roomType) {
      newErrors.general = newErrors.general || [];
      newErrors.general.push('Please select a room type');
      isValid = false;
    }

    if (!formState.totalAmount || formState.totalAmount <= 0) {
      newErrors.general = newErrors.general || [];
      newErrors.general.push('Invalid total amount');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formState, validateGuestInfo, validateDates]);

  const updateFormState = useCallback((field: keyof FormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return {
    formState,
    errors,
    updateFormState,
    validateForm,
    validateGuestInfo,
    validateDates,
  };
};
