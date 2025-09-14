'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BookingContextType {
  selectedHotel: any | null;
  selectedRoom: any | null;
  bookingDates: {
    checkIn: Date | null;
    checkOut: Date | null;
  };
  guestDetails: {
    adults: number;
    children: number;
  };
  setSelectedHotel: (hotel: any) => void;
  setSelectedRoom: (room: any) => void;
  setBookingDates: (dates: { checkIn: Date | null; checkOut: Date | null }) => void;
  setGuestDetails: (details: { adults: number; children: number }) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [selectedHotel, setSelectedHotel] = useState<any | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [bookingDates, setBookingDates] = useState<{
    checkIn: Date | null;
    checkOut: Date | null;
  }>({
    checkIn: null,
    checkOut: null,
  });
  const [guestDetails, setGuestDetails] = useState({
    adults: 1,
    children: 0,
  });

  const value = {
    selectedHotel,
    selectedRoom,
    bookingDates,
    guestDetails,
    setSelectedHotel,
    setSelectedRoom,
    setBookingDates,
    setGuestDetails,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}
