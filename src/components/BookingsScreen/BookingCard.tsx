"use client";
import BreadcrumbNav from '../details-page/Breadcrumb-Nav';
import { Box, Grid, Typography } from '@mui/material';
import Star from '@/assets/icons/Star.png';
import Image from 'next/image';
import Dest from "@/assets/images/destination.png";
import { useState, useEffect, useRef } from 'react';

interface Breadcrumb {
  href: string;
  text: string;
}

const linkToBookingScreen: Breadcrumb[] = [
  { href: '', text: 'Home' },
  { href: '', text: 'Tours' },
  { href: '', text: 'Valley of Flowers' }
]

const placeholderData = {
  destination: "Valley of Flowers",
  category: "Trekking Tours in India",
  rating: 4.5,
  description:
    "Escape to the misty hills of Coorg, a romantic paradise. Explore lush coffee plantations, trek through verdant forests, and relax by serene waterfalls. Indulge in local cuisine and enjoy cozy evenings together. Create unforgettable memories in this idyllic honeymoon destination."
};

const BookingCard: React.FC = () => {
  const [readMore, setReadMore] = useState<boolean>(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState<boolean>(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Check if the text overflows the container
  const checkOverflow = () => {
    if (descriptionRef.current) {
      const isOverflowing = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setShowReadMoreButton(isOverflowing);
    }
  };

  // Check for overflow on component mount and window resize
  useEffect(() => {
    checkOverflow(); // Check on initial render
    window.addEventListener('resize', checkOverflow); // Check on resize

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  return (
    <>
      {/* Breadcrumb Component */}
      <BreadcrumbNav breadcrumbs={linkToBookingScreen} currentTitle="Booking" />

      {/* Title */}
      <Typography variant="h6" className="text-carrot-orange font-bold w-auto h-[24px]" component="div">
        Booking {placeholderData.destination}
      </Typography>

      {/* Description section */}
      <Grid container spacing={2} className="mt-[30px]">

        {/* Image section */}
        <Grid item xs={12} md={6} gap={8}>
          <div className="mx-auto rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="relative">
              <Image
                src={Dest}
                alt="dest"
                layout="responsive"
                objectFit="cover"
                className="rounded-t-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </Grid>

        {/* Text section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ padding: '16px' }}>
            <h1 className="text-4xl font-bold text-carrot-orange mb-2">{placeholderData.destination}</h1>
            <div className="flex flex-wrap items-center my-4">
              
              { placeholderData.rating > 0 && (<>
              <div className="rounded-xl border-2 border-carrot-orange px-1">
                <span className="text-carrot-orange text-md font-[500] mr-2">{placeholderData.category}</span>
              </div><Image
                  src={Star}
                  alt="Star Icon"
                  width={20}
                  height={20}
                  className="ml-4" /><span className="ml-1 text-gray-700">{placeholderData.rating} Ratings</span>
                  </>)}

            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
              <p
                ref={descriptionRef}
                className={`text-heavy-metal mt-2 pr-8 ${readMore ? 'max-h-full' : 'max-h-24 overflow-hidden'}`}
              >
                {placeholderData.description}
              </p>

              {showReadMoreButton && (
                <span
                  className="text-carrot-orange cursor-pointer"
                  onClick={() => setReadMore((prev) => !prev)}
                >
                  {readMore ? 'Read less' : 'Read more'}
                </span>
              )}
            </div>
          </Box>
        </Grid>

      </Grid>
    </>
  );
};

export default BookingCard;
