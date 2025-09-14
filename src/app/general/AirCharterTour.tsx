"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import Bridge from "../../../public/assets/images/inspiration.png";
import { getAirCharterTours, AirCharterTour as AirCharterTourType } from "@/services/airCharterService";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const AirCharter: React.FC = () => {
  const [tours, setTours] = useState<AirCharterTourType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAirCharterTours();
  }, []);

  const fetchAirCharterTours = async () => {
    try {
      setIsLoading(true);
      const response = await getAirCharterTours();
      
      if (response.success && response.data) {
        setTours(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching air charter tours:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (tourId: string) => {
    router.push(`/tours/${tourId}`);
  };

  return (
    <>
      <div className="px-4 md:px-10 my-4 justify-center items-center">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold py-4 md:py-6">
            Explore our Air Charter Tours
          </div>
          {/* Right side: arrows */}
          <div className="flex gap-2">
            <ArrowCircleLeft
              size={45}
              weight="light"
              color="#FF8B02"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              // onClick={handlePrev}
            />
            <ArrowCircleRight
              size={45}
              weight="light"
              color="#FF8B02"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              // onClick={handleNext}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <CircularProgress sx={{ color: '#FF8B02' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.map((card, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  <Image 
                    src={card.imageUrl ? card.imageUrl : Bridge} 
                    alt={card.title} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#FF8B02] text-white text-xs px-2 py-1 rounded-md">
                      HELICOPTER
                    </span>
                  </div>
                  {card.price && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-white text-[#FF8B02] text-xs px-2 py-1 rounded-md font-semibold">
                        ₹{card.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-3">{card.description}</p>
                  {card.duration && (
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Duration:</span> {card.duration}
                    </p>
                  )}
                  {card.fromLocation && card.toLocation && (
                    <p className="text-sm text-gray-700 mb-3">
                      <span className="font-medium">Route:</span> {card.fromLocation} to {card.toLocation}
                    </p>
                  )}
                  <button 
                    className="bg-[#FF8B02] text-white px-4 py-2 rounded-md text-sm hover:bg-[#E67E00] transition-colors"
                    onClick={() => handleViewDetails(card.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AirCharter;
