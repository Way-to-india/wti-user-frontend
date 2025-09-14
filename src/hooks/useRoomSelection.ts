import { SelectedRoom } from '@/types/hotel';
import { useState } from 'react';

export const useRoomSelection = () => {
  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: SelectedRoom;
  }>({});

  const handleRoomCountChange = (
    roomId: string,
    action: 'increment' | 'decrement',
    price: number,
    taxRate?: number,
    priceWithTax?: number
  ) => {
    setSelectedRooms(prev => {
      const currentRoom = prev[roomId] || { price, count: 0 };
      let newCount = currentRoom.count;

      if (action === 'increment' && newCount < 5) {
        newCount++;
      } else if (action === 'decrement' && newCount > 0) {
        newCount--;
      }

      if (newCount === 0) {
        const { [roomId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [roomId]: { price, count: newCount, taxRate, priceWithTax },
      };
    });
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedRooms).reduce((total, room) => {
      return total + room.price * room.count;
    }, 0);
  };

  const calculateTaxAmount = () => {
    return Object.entries(selectedRooms).reduce((total, [, details]) => {
      const taxRate = details.taxRate !== undefined ? details.taxRate : 10;
      return total + details.price * details.count * (taxRate / 100);
    }, 0);
  };

  const calculateTotalWithTax = () => {
    return calculateTotalPrice() + calculateTaxAmount();
  };

  return {
    selectedRooms,
    handleRoomCountChange,
    calculateTotalPrice,
    calculateTaxAmount,
    calculateTotalWithTax,
  };
};
