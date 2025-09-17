import { useMemo } from 'react';
import { RoomDetails } from '@/types/booking';

export const useBookingCalculations = (
  selectedRooms: { [key: string]: RoomDetails } | null,
  numberOfNights: number
) => {
  const calculations = useMemo(() => {
    if (!selectedRooms || Object.keys(selectedRooms).length === 0) {
      return {
        totalPrice: 0,
        taxAmount: 0,
        totalWithTax: 0,
        averageTaxRate: 0,
      };
    }

    const totalPrice = Object.values(selectedRooms).reduce(
      (total, room) => total + room.price * room.count * numberOfNights,
      0
    );

    const taxAmount = Object.values(selectedRooms).reduce((totalTax, room) => {
      const taxRate = room.taxRate !== undefined ? room.taxRate : 10;
      const roomPrice = room.price * room.count * numberOfNights;
      return totalTax + roomPrice * (taxRate / 100);
    }, 0);

    const totalRoomCount = Object.values(selectedRooms).reduce(
      (count, room) => count + room.count,
      0
    );

    const weightedTaxRateSum = Object.values(selectedRooms).reduce((sum, room) => {
      const taxRate = room.taxRate !== undefined ? room.taxRate : 10;
      return sum + taxRate * room.count;
    }, 0);

    const averageTaxRate = Math.round((weightedTaxRateSum / totalRoomCount) * 10) / 10;

    return {
      totalPrice,
      taxAmount,
      totalWithTax: totalPrice + taxAmount,
      averageTaxRate,
    };
  }, [selectedRooms, numberOfNights]);

  return calculations;
};
