import React from "react";
import Image from "next/image";
import Places from "@/assets/images/destination.png";

export function Packages() {
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[32px] text-[20px] md:mb-[32px] mb-[16px]">
        Adilabad packages
      </h1>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide p-2 w-full">
        <div className="relative flex-shrink-0 w-[437px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[266px] rounded-t-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="underline text-[#000000] text-[18px] font-bold cursor-pointer text-wrap">
              Badrinath Yatra By Helicopter  [1Nights / 2 Days]
            </h3>
            <p className="text-[#262626] text-[14px] text-wrap">
              Rajasthan Tour Package as the name itself suggests, provides you
              all wonderful experiences that Rajasthan offers. Forts, Palaces,
              Cenotaphs, Havelis, Desert, Folk performances, Lakes and much
              more.
            </p>
          </div>
        </div>
        <div className="relative flex-shrink-0 w-[437px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[266px] rounded-t-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="underline text-[#000000] text-[18px] font-bold cursor-pointer text-wrap">
              Badrinath Yatra By Helicopter  [1Nights / 2 Days]
            </h3>
            <p className="text-[#262626] text-[14px] text-wrap">
              Rajasthan Tour Package as the name itself suggests, provides you
              all wonderful experiences that Rajasthan offers. Forts, Palaces,
              Cenotaphs, Havelis, Desert, Folk performances, Lakes and much
              more.
            </p>
          </div>
        </div>
        <div className="relative flex-shrink-0 w-[437px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[266px] rounded-t-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="underline text-[#000000] text-[18px] font-bold cursor-pointer text-wrap">
              Badrinath Yatra By Helicopter  [1Nights / 2 Days]
            </h3>
            <p className="text-[#262626] text-[14px] text-wrap">
              Rajasthan Tour Package as the name itself suggests, provides you
              all wonderful experiences that Rajasthan offers. Forts, Palaces,
              Cenotaphs, Havelis, Desert, Folk performances, Lakes and much
              more.
            </p>
          </div>
        </div>
        <div className="relative flex-shrink-0 w-[437px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[266px] rounded-t-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="underline text-[#000000] text-[18px] font-bold cursor-pointer text-wrap">
              Badrinath Yatra By Helicopter  [1Nights / 2 Days]
            </h3>
            <p className="text-[#262626] text-[14px] text-wrap">
              Rajasthan Tour Package as the name itself suggests, provides you
              all wonderful experiences that Rajasthan offers. Forts, Palaces,
              Cenotaphs, Havelis, Desert, Folk performances, Lakes and much
              more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
