// components/Itinerary.tsx
import React, { useState } from 'react';
import Image from "next/image";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HotelDetails from './HotelDetails';
import TransportationDetails from './TransportationDetails';
import { CurrencyInr } from "@phosphor-icons/react";
import { useRouter } from 'next/navigation';
import { IItinerary } from './helpers';

interface ItineraryProps {
  hotelRef: React.RefObject<HTMLDivElement>;
  transportationRef: React.RefObject<HTMLDivElement>;
  itineraryprops: IItinerary;
}

const Itinerary: React.FC<ItineraryProps> = ({
  hotelRef,
  transportationRef,
  itineraryprops,
}) => {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(0); // Track selected day

  return (
    <Box>
      <div className="grid grid-cols-12 gap-4 text-black">
        {/* Left Column: List of Days */}
        <div className="col-span-2 font-bold text-sm tracking-wider">
          {itineraryprops.routines.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`p-2.5 cursor-pointer rounded-md flex items-center justify-center ${
                selectedDay === index
                  ? "bg-[#FF8B02] text-white"
                  : "bg-transparent"
              } mb-2`}
            >
              DAY {item.day}
            </div>
          ))}
        </div>

        {/* Right Column: Details of Selected Day */}
        <div className="col-span-7">
          {/* Plan of Action section */}
          <div>
            <div className="uppercase font-medium text-sm mb-2">Plan of Action</div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">{itineraryprops.routines[selectedDay].title}</h3>
              
              <div className="flex mb-4">
                <Image
                  src={itineraryprops.routines[selectedDay].image_url || "/assets/images/destination.png"}
                  width={250}
                  height={150}
                  className="rounded-lg mr-4"
                  alt="destination image"
                />
                <p className="text-sm">{itineraryprops.routines[selectedDay].general_details}</p>
              </div>
            </div>
          </div>

          {/* Hotel Information section */}
          <div className="mt-8">
            <div className="uppercase font-medium text-sm mb-2">Hotel Information</div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm mb-2">1 night stay in Rishikesh</div>
              
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Sherpa Hotel</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span className="text-sm">4.5 Ratings</span>
                  <button className="ml-4 text-[#FF8B02] text-sm font-medium">Change</button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 my-3">
                <span className="border rounded-lg px-3 py-1 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  2-3 Guests
                </span>
                <span className="border rounded-lg px-3 py-1 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  150 sq.ft
                </span>
                <span className="border rounded-lg px-3 py-1 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  4 Star
                </span>
                <span className="border rounded-lg px-3 py-1 text-xs flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Rishikesh
                </span>
                <span className="border rounded-lg px-3 py-1 text-xs flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Only Breakfast
                </span>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Standard Room x 1</h4>
                <h4 className="font-medium text-sm mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-y-2">
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Comfortable bedding and linens
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Private Bathroom
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Hot Water
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Television
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Wifi-access
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Desk
                  </div>
                  <div className="w-1/2 flex items-center text-xs">
                    <span className="mr-2">•</span>
                    Wardrobe
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transportation Information section */}
          <div className="mt-8">
            <div className="uppercase font-medium text-sm mb-2">Transportation Information</div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-sm mb-2">Delhi to Rishikesh</div>
              
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Volvo</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">★</span>
                  <span className="text-sm">4.5 Ratings</span>
                  <button className="ml-4 text-[#FF8B02] text-sm font-medium">Change</button>
                </div>
              </div>
              
              {/* Transportation details would go here */}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Trip Price */}
        <div className="col-span-3">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-700 uppercase font-medium text-sm mb-2">Trip Price</h3>
            <div className="text-[#FF8B02] text-2xl font-bold flex items-center my-1">
              <span className="text-3xl">₹</span>6,500 <span className="text-base text-gray-500 font-normal ml-1">per person</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">Excluding applicable taxes</p>
            
            <button 
              onClick={() => router.push("/trip-details/booking")} 
              className="w-full bg-[#FF8B02] text-white font-bold py-3 rounded-md hover:bg-orange-600 transition duration-200">
              Book Now
            </button>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-2">Have Questions?</h3>
              <p className="text-sm text-gray-600 mb-3">Don't worry, our team is there to help you out</p>
              <button className="w-full border border-[#FF8B02] text-[#FF8B02] font-bold py-3 rounded-md hover:bg-orange-50 transition duration-200">
                Enquire Now
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-2">Coupon Code</h3>
              <input 
                type="text" 
                placeholder="Enter Coupon code here" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
              />
              <button className="w-full bg-gray-400 text-white font-bold py-2 rounded-md">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Itinerary;
