import React from "react";
import Image from "next/image";
import { placesData } from "./places.dto";

export function Facts() {
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[32px] text-[24px] md:mb-[32px] mb-[16px]">
        Facts
      </h1>
      <p className="text-[#281D1B] lg:text-[20px] text-[16px] md:mb-[32px] mb-[16px]">
        {placesData["facts"][0].description}
      </p>
      <div className="flex flex-row overflow-x-auto gap-[16px] scrollbar-hide">
        <Image
          className="w-[603px] lg:h-[648px] md:rounded-[30px] rounded object-cover"
          src={placesData["facts"][0].img1}
          alt="places"
        />
        <Image
          className="w-[603px] lg:h-[648px] md:rounded-[30px] rounded object-cover"
          src={placesData["facts"][0].img1}
          alt="places"
        />
      </div>
    </div>
  );
}
