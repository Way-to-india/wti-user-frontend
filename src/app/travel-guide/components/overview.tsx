import React from "react";
import Image from "next/image";
import Mosque from "@/assets/images/mosque.svg"

export function Overview() {
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[48px] text-[24px] md:mb-[32px] mb-[16px]">
        Destinations Guide
      </h1>
      <Image className="w-[100%] h-[100%] md:rounded-[30px] rounded" src={Mosque} alt="mosque" />
    </div>
  );
}
