'use client';
import TourCard from '@/components/tours/TourCard';
import { getTours } from '@/services/tourService';
import { ArrowCircleLeft, ArrowCircleRight } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: string;
  rating?: number;
  imageUrls: string[];
  location?: string;  
}

const FeaturedTours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setIsLoading(true);
      // Fetch featured tours with a limit parameter
      const response = await getTours({
        limit: 9, // Fetch 9 tours max (3 pages)
        // sortBy: 'popular' // Assuming your API supports sorting by popularity
      });
      console.log('Fetched tours:', response);
      if (response.success && response.data?.tours) {
        // Map the API response to match Tour interface
        const mappedTours = Array.isArray(response.data.tours)
          ? response.data.tours.map((tour: any) => {
              return {
                id: tour.id,
                title: tour.title || tour.tour_title || 'Amazing Tour',
                description: tour.description || 'Experience the beauty of India',
                price: tour.price?.toString() || '₹5,999',
                rating: tour.rating || 4.5,
                imageUrls: Array.isArray(tour.imageUrls)
                  ? tour.imageUrls
                  : Array.isArray(tour.image_urls)
                  ? tour.image_urls
                  : [tour.image || '/assets/images/Frame 907.png'],
                location: tour.location || tour.start_city_id || 'India',
              };
            })
          : [];
        setTours(mappedTours);
      } else {
        console.error('Error fetching tours:', response.message);
        // Fallback data in case API fails
        setTours([
          {
            id: '1',
            title: 'Golden Triangle Tour',
            description: 'Explore Delhi, Agra and Jaipur in luxury',
            price: '₹15,999',
            rating: 4.8,
            imageUrls: ['/assets/images/Frame 907.png'],
            location: 'Delhi',
          },
          {
            id: '2',
            title: 'Kerala Backwaters Experience',
            description: "Serene houseboat journey through God's own country",
            price: '₹12,599',
            rating: 4.7,
            imageUrls: ['/assets/images/Frame 908.png'],
            location: 'Kerala',
          },
          {
            id: '3',
            title: 'Rajasthan Heritage Tour',
            description: 'Royal palaces, forts and cultural experiences',
            price: '₹18,999',
            rating: 4.9,
            imageUrls: ['/assets/images/Frame 909.png'],
            location: 'Jaipur',
          },
          {
            id: '4',
            title: 'Himalayan Adventure Package',
            description: 'Trekking and adventure in the mountains',
            price: '₹21,999',
            rating: 4.6,
            imageUrls: ['/assets/images/Frame 911.png'],
            location: 'Himachal',
          },
          {
            id: '5',
            title: 'Goa Beach Vacation',
            description: "Sun, sand and parties at India's favorite beaches",
            price: '₹9,999',
            rating: 4.5,
            imageUrls: ['/assets/images/Frame 907.png'],
            location: 'Goa',
          },
          {
            id: '6',
            title: 'Varanasi Spiritual Journey',
            description: 'Ancient temples and spiritual experiences',
            price: '₹8,499',
            rating: 4.7,
            imageUrls: ['/assets/images/Frame 908.png'],
            location: 'Varanasi',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      // Use the same fallback data here
      setTours([
        {
          id: '1',
          title: 'Golden Triangle Tour',
          description: 'Explore Delhi, Agra and Jaipur in luxury',
          price: '₹15,999',
          rating: 4.8,
          imageUrls: ['/assets/images/Frame 907.png'],
          location: 'Delhi',
        },
        {
          id: '2',
          title: 'Kerala Backwaters Experience',
          description: "Serene houseboat journey through God's own country",
          price: '₹12,599',
          rating: 4.7,
          imageUrls: ['/assets/images/Frame 908.png'],
          location: 'Kerala',
        },
        {
          id: '3',
          title: 'Rajasthan Heritage Tour',
          description: 'Royal palaces, forts and cultural experiences',
          price: '₹18,999',
          rating: 4.9,
          imageUrls: ['/assets/images/Frame 909.png'],
          location: 'Jaipur',
        },
        {
          id: '4',
          title: 'Himalayan Adventure Package',
          description: 'Trekking and adventure in the mountains',
          price: '₹21,999',
          rating: 4.6,
          imageUrls: ['/assets/images/Frame 911.png'],
          location: 'Himachal',
        },
        {
          id: '5',
          title: 'Goa Beach Vacation',
          description: "Sun, sand and parties at India's favorite beaches",
          price: '₹9,999',
          rating: 4.5,
          imageUrls: ['/assets/images/Frame 907.png'],
          location: 'Goa',
        },
        {
          id: '6',
          title: 'Varanasi Spiritual Journey',
          description: 'Ancient temples and spiritual experiences',
          price: '₹8,499',
          rating: 4.7,
          imageUrls: ['/assets/images/Frame 908.png'],
          location: 'Varanasi',
        },
      ]);
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

  const handleViewAll = () => {
    router.push('/tours');
  };

  const visibleTours = tours.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);

  console.log('Visible tours:', visibleTours);

  return (
    <div className="mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold pb-2 md:pb-0">
          Featured Tours
        </h2>
        <div className="flex gap-2">
          <ArrowCircleLeft
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={currentIndex > 0 ? handlePrev : undefined}
          />
          <ArrowCircleRight
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              currentIndex + ITEMS_PER_PAGE >= tours.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={currentIndex + ITEMS_PER_PAGE < tours.length ? handleNext : undefined}
          />
        </div>
      </div>
      <div className="mb-6">
        <p className="text-[#2D2F37] text-sm md:text-base">
          Discover our most popular tour packages handpicked for unforgettable adventures across
          India
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: direction === 'right' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === 'right' ? -50 : 50 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {isLoading ? (
            <div className="col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-[350px] rounded-lg animate-pulse bg-gray-200" />
                ))}
              </div>
            </div>
          ) : tours.length > 0 ? (
            visibleTours.map(tour => <TourCard key={tour.id} tour={tour as any} />)
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No featured tours available at the moment.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {visibleTours.length ? (
        <div className="text-center mt-8">
          <button
            onClick={handleViewAll}
            className="px-6 py-2 rounded-md border border-[#FF8B02] text-[#FF8B02] hover:bg-[#FF8B02] hover:text-white transition-all duration-300"
          >
            View All Tours
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FeaturedTours;
