import React from 'react';
import Image from 'next/image';

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="font-bold text-gray-900 lg:text-6xl md:text-5xl text-3xl tracking-tight">
          Destination Guide
        </h1>
        <p className="text-gray-600 lg:text-xl md:text-lg max-w-3xl">
          Explore the vibrant cultures, stunning landscapes, and hidden gems across India. Your
          journey to unforgettable experiences starts here.
        </p>
      </div>

      <div className="relative w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden shadow-2xl group">
        <Image
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://www.waytoindia.com/images/travel-guide.jpg"
          alt="Travel destinations across India"
          width={1600}
          height={900}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <p className="text-sm font-medium bg-orange-500 px-3 py-1 rounded-full inline-block">
            Discover India
          </p>
        </div>
      </div>
    </div>
  );
}
