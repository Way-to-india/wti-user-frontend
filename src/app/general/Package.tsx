'use client';
import TourCard from '@/components/tours/TourCard';
import { getTours } from '@/services/tourService';
import { CircularProgress } from '@mui/material';
import { ArrowCircleLeft, ArrowCircleRight } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: string;
  rating?: number;
  imageUrls: string[];
}

const Package: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 3;

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching tours...');
      const response = await getTours();
      console.log('API Response:', response);

      if (response.success) {
        // Map the API response to match TourCardProps
        const mappedTours = Array.isArray(response.data)
          ? response.data.map((tour: any) => {
              const mappedTour = {
                id: tour.id,
                title: tour.title,
                description: tour.description,
                price: tour.price?.toString() || '0',
                rating: tour.rating || 5,
                imageUrls: Array.isArray(tour.images) ? tour.images : [tour.image || ''],
              };
              console.log('Mapped tour:', mappedTour);
              return mappedTour;
            })
          : [];
        console.log('Mapped tours:', mappedTours);
        setTours(mappedTours);
      } else {
        console.error('Error fetching tours:', response.message);
        setTours([]);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + ITEMS_PER_PAGE < tours.length) {
      setDirection('right');
      setCurrentIndex(prev => prev + ITEMS_PER_PAGE);
    }
  };

  const handlePrev = () => {
    if (currentIndex - ITEMS_PER_PAGE >= 0) {
      setDirection('left');
      setCurrentIndex(prev => prev - ITEMS_PER_PAGE);
    }
  };

  const visibleTours = tours.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

  return (
    <div className="relative my-4 -mt-36 justify-center items-center px-10 z-20 pb-10">
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <ArrowCircleLeft
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePrev}
          />
          <ArrowCircleRight
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              currentIndex + ITEMS_PER_PAGE >= tours.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleNext}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center h-64">
              <CircularProgress />
            </div>
          ) : (
            visibleTours.map(tour => <TourCard key={tour.id} tour={tour} />)
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Package;
