'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Fire from '../../../public/assets/images/hot-sale 1.png';
import { getDeals, Deal } from '@/services/dealsService';
import { CircularProgress } from '@mui/material';
import { ArrowCircleLeft, ArrowCircleRight } from '@phosphor-icons/react';

const Deals: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await getDeals();

      if (response.success && response.data) {
        setDeals(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (activeIndex < deals.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <>
      <div className="px-4 md:px-10 my-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold py-2 md:py-6">
            Avail Our Amazing Deals
          </div>
          {deals.length > 1 && (
            <div className="flex gap-2">
              <ArrowCircleLeft
                size={45}
                weight="light"
                color="#FF8B02"
                className={`cursor-pointer ${
                  activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handlePrev}
              />
              <ArrowCircleRight
                size={45}
                weight="light"
                color="#FF8B02"
                className={`cursor-pointer ${
                  activeIndex === deals.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNext}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <CircularProgress sx={{ color: '#FF8B02' }} />
          </div>
        ) : deals.length > 0 ? (
          <div className="flex border-2 border-[#FF8B02] text-[#FF8B02] p-4 items-center rounded-lg">
            <Image src={Fire} width={70} className="m-2 mr-6 hidden md:block" alt="Hot deal" />
            <div className="flex flex-col">
              <div className="flex items-center mb-1">
                <Image src={Fire} width={40} className="mr-2 md:hidden" alt="Hot deal" />
                <span className="text-[#FF8B02] text-xl md:text-2xl font-semibold">
                  {deals[activeIndex].title}
                </span>
              </div>
              <span className="text-[#FF8B02] text-base md:text-xl">
                {deals[activeIndex].description}
                {deals[activeIndex].code && (
                  <span className="ml-2 bg-white px-2 py-1 rounded text-sm font-bold">
                    CODE: {deals[activeIndex].code}
                  </span>
                )}
              </span>
              {deals[activeIndex].validUntil && (
                <span className="text-sm mt-2 text-gray-600">
                  Valid until: {new Date(deals[activeIndex].validUntil).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">No current deals available</div>
        )}
      </div>
    </>
  );
};

export default Deals;
