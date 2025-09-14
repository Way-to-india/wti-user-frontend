'use client';
import React, { useEffect, useState } from 'react';
import {
    UsersFour,
    MapPinArea,
    SuitcaseRolling,
    AirplaneTakeoff,
    Train,
    Bus,
    Mountains,
    Island,
} from '@phosphor-icons/react';

const travelIcons = [
    UsersFour,
    MapPinArea,
    SuitcaseRolling,
    AirplaneTakeoff,
    Train,
    Bus,
    Mountains,
    Island,
];

const CircleLoader: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const Icon = travelIcons[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % travelIcons.length);
    }, 500); // change icon every 1 second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-sky-50 backdrop-blur-sm">
      <div className="transition-all duration-500 ease-in-out transform scale-110 animate-fade">
        <Icon size={64} weight="duotone" className="text-carrot-orange" />
      </div>
      <p className="mt-4 text-lg font-medium text-gray-700 animate-pulse">
        Planning your perfect trip...
      </p>
    </div>
  );
};

export default CircleLoader;
