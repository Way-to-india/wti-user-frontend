import React, { useState } from "react";
import { placesData } from "./places.dto";
import { motion } from "framer-motion";
import { Star, ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";

export function PlacesToVisits() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle moving to the next slide
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 6 - 1 ? 0 : prevIndex + 1));
  };

  // Handle moving to the previous slide
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 6 - 1 : prevIndex - 1));
  };

  // Slide animation variants for Framer Motion
  const slideVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  };
  return (
    <div className="">
      <h1 className="font-bold text-[#281D1B] lg:text-[32px] text-[24px] md:mb-[32px] mb-[16px]">
        Places to visit in Adilabad
      </h1>
      <p className="text-[#281D1B] lg:text-[20px] text-[16px] md:mb-[32px] mb-[16px]">
        {placesData["places to visit"][0].description}
      </p>
      <div className="flex flex-row justify-between mb-6">
        <input
          type="text"
          className="w-[334px] p-2 border border-gray-300 rounded-lg"
          placeholder="Search for a Places"
        />
        <div className="hidden sm:flex flex-row gap-2">
          <ArrowCircleLeft
            className="text-orange-500 text-[32px] cursor-pointer"
            onClick={handlePrev}
          />
          <ArrowCircleRight
            className="text-orange-500 text-[32px] cursor-pointer"
            onClick={handleNext}
          />
        </div>
      </div>
      <motion.div
        className="flex gap-6 overflow-x-auto scrollbar-hide p-2 w-full"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideVariants}
        transition={{ duration: 0.5 }}
        key={currentIndex}
      >
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>

        {/* Repeat the structure for other cards as needed */}
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>
        {/* Repeat the structure for other cards as needed */}
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>
        {/* Repeat the structure for other cards as needed */}
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>
        {/* Repeat the structure for other cards as needed */}
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>
        {/* Repeat the structure for other cards as needed */}
        <div className="relative bg-cover bg-bannerMosque bg-repeat bg-center w-[319px] h-[420px] pt-[351px] rounded-lg flex-shrink-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>

          {/* Content */}
          <div className="relative flex flex-col gap-[4px] pl-[20px]">
            <strong className="text-[#FF8B02] text-[16px] font-bold">
              {placesData["places to visit"][1].name}
            </strong>
            <p className="text-[#FFFFFF] text-[14px]">
              {placesData["places to visit"][1].distance}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
