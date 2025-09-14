import React from 'react';
import Image from 'next/image';
import { FiUsers, FiHome, FiStar, FiMapPin, FiClock } from 'react-icons/fi';

interface Day {
  day: number;
  title: string;
  description: string;
  location?: string;
  hotel?: {
    name: string;
    image: string;
    rating: number;
    location: string;
    roomType: string;
    guestCount: string;
    area: string;
    starRating: string;
    mealPlan: string;
    amenities: string[];
  };
  transportation?: {
    type: string;
    image: string;
    passengerCount: string;
    transportType: string;
    pickupLocation: string;
    pickupTime: string;
    vehicleType: string;
    amenities: string[];
  };
}

interface ItinerarySectionProps {
  days: Day[];
}

export const ItinerarySection: React.FC<ItinerarySectionProps> = ({ days }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Hotel Details</h2>
      
      {days.map((day) => (
        <div key={day.day} className="space-y-4">
          {/* Day Number */}
          <div className="flex items-start gap-6">
            <div className="bg-orange-500 text-white px-4 py-2 rounded">
              DAY {day.day}
            </div>
          </div>

          {/* Plan of Action */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-gray-500 uppercase text-sm font-medium mb-4">PLAN OF ACTION</h3>
            <div className="flex gap-6">
              <div className="w-1/4">
                <div className="relative h-40 w-full rounded-lg overflow-hidden">
                  <Image
                    src={day.hotel?.image || '/images/placeholder.jpg'}
                    alt={day.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-3/4">
                <h4 className="font-medium text-lg mb-2">{day.title}</h4>
                <p className="text-gray-600">{day.description}</p>
              </div>
            </div>
          </div>

          {/* Hotel Information */}
          {day.hotel && (
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-500 uppercase text-sm font-medium">HOTEL INFORMATION</h3>
                  <button className="text-orange-500 text-sm">Change</button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">{day.hotel.roomType} in {day.hotel.location}</p>
                </div>

                <div className="flex gap-6">
                  <div className="w-1/3">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src={day.hotel.image}
                        alt={day.hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-lg">{day.hotel.name}</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{day.hotel.rating} Ratings</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiUsers className="mr-2" /> {day.hotel.guestCount}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiHome className="mr-2" /> {day.hotel.area}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiStar className="mr-2" /> {day.hotel.starRating}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiMapPin className="mr-2" /> {day.hotel.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-green-600">
                        {day.hotel.mealPlan}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm text-gray-500 mb-2">Amenities</h5>
                      <div className="flex flex-wrap gap-x-6">
                        {day.hotel.amenities.map((amenity, index) => (
                          <span key={index} className="text-gray-600 text-sm flex items-center">
                            <span className="mr-2">•</span>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transportation Information */}
          {day.transportation && (
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-500 uppercase text-sm font-medium">TRANSPORTATION INFORMATION</h3>
                  <button className="text-orange-500 text-sm">Change</button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">{day.transportation.pickupLocation} to {day.hotel?.location}</p>
                </div>

                <div className="flex gap-6">
                  <div className="w-1/4">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image
                        src={day.transportation.image}
                        alt={day.transportation.type}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-3/4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-lg">{day.transportation.type}</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">4.5 Ratings</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiUsers className="mr-2" /> {day.transportation.passengerCount}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        {day.transportation.transportType}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        Pick up from {day.transportation.pickupLocation}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100">
                        <FiClock className="mr-2" /> Pick up time {day.transportation.pickupTime}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">{day.transportation.vehicleType}</p>
                      <div className="flex flex-wrap gap-x-6">
                        {day.transportation.amenities.map((amenity, index) => (
                          <span key={index} className="text-gray-600 text-sm flex items-center">
                            <span className="mr-2">•</span>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 