import React from "react";
import Image from "next/image";
import Bridge from "@/assets/images/inspiration.png";
import Export from "@/assets/icons/Export.png";
import { places_overview } from "./places.dto";
import { Sun, Snowflake, CloudRain, Heart } from "@phosphor-icons/react";

export function Overview() {
  const hotelData = {
    name: "Park Inn by Radisson Goa Candolim",
    category: "5 Star Hotel",
    rating: 4.5,
    description:
      "Lavish rooms, multiple dining spots, an outdoor swimming pool and a host of amenities await you for a delightful stay at this luxurious property.",
    amenities: [
      "Gym",
      "Swimming Pool",
      "Spa",
      "Bar",
      "Cafe",
      "Shuttle Service",
      "CCTV",
      "Entertainment",
      "+56 more",
    ],
    mainImage: Bridge,
    galleryImages: [Bridge, Bridge, Bridge],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Main Image Section */}
      <div className="">
        <Image
          src={hotelData.mainImage}
          alt={hotelData.name}
          className="rounded-lg object-cover w-full"
        />
      </div>

      {/* Hotel Info Section */}
      <div>
        {/* Title and Ratings */}
        <div className="flex justify-between items-start">
          <h1 className="lg:text-3xl text-[18px] font-bold text-carrot-orange">
            Andaman Water Sports
          </h1>
          <button className="p-2 bg-carrot-orange rounded-full" title="Export">
            <Image src={Export} alt="Export" width={32} height={32} />
          </button>
        </div>

        {/* Category and Ratings */}
        <h3 className="font-bold text-[#262626] text-[32px]">Overview</h3>

        {/* Description */}
        <div className="grid lg:grid-cols-3 grid-cols-2 gap-[16px]">
          <div className="lg:w-[186px] w-full flex flex-col font-sans border-[#BABABA] border-[1px] rounded-[10px] p-4">
            <div className="flex flex-row gap-2 items-center">
              <Sun className="text-xl" />
              <p className="text-[#262626] text-[16px]">
                {places_overview[0].session}
              </p>
            </div>
            <strong>{places_overview[0].degree}</strong>
            <strong>{places_overview[0].range}</strong>
          </div>

          <div className="lg:w-[186px] w-full flex flex-col font-sans border-[#BABABA] border-[1px] rounded-[10px] p-4">
            <div className="flex flex-row gap-2 items-center">
              <Snowflake className="text-xl" />
              <p className="text-[#262626] text-[16px]">
                {places_overview[1].session}
              </p>
            </div>
            <strong>{places_overview[1].session}</strong>
            <strong>{places_overview[1].range}</strong>
          </div>
          <div className="lg:w-[186px] w-full flex flex-col font-sans border-[#BABABA] border-[1px] rounded-[10px] p-4">
            <div className="flex flex-row gap-2 items-center">
              <CloudRain className="text-xl" />
              <p className="text-[#262626] text-[16px]">
                {places_overview[2].session}
              </p>
            </div>
            <strong>{places_overview[2].session}</strong>
            <strong>{places_overview[2].range}</strong>
          </div>
          <div className="lg:w-[186px] w-full flex flex-col font-sans border-[#BABABA] border-[1px] rounded-[10px] p-4">
            <div className="flex flex-row gap-2 items-center">
              <Heart className="text-xl" />
              <p className="text-[#262626] text-[16px]">
                {places_overview[3].session}
              </p>
            </div>
            <strong>{places_overview[3].session}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
