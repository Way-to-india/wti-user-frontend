import React from "react";
import Image from "next/image";
import { placesData } from "./places.dto";

/** Places Overview */
export function Overview() {
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[48px] text-[24px] md:mb-[32px] mb-[16px]">
        {placesData["overview"][0].title}
      </h1>
      <p className="text-[#281D1B] lg:text-[20px] text-[16px] md:mb-[16px] mb-[10px]">
        {placesData["overview"][0].description}
      </p>
      <Image
        className="w-[100%] h-[100%] md:rounded-[30px] rounded"
        src={placesData["overview"][0].Img}
        alt="places"
      />
    </div>
  );
}
