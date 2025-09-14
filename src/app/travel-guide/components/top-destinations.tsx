import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowRtIcon from "@/assets/icons/arrow-rt-icon.svg";
import { topDestinationsData } from "./travel-guide.dto";
import { TravelGuideNonAuthRoutes } from "@/app/utils/urls";

/** Top Destinations */
export function TopDestinations() {
  const Router = useRouter();
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[30px] text-[18px] md:mb-[32px] mb-[16px]">
        Top destinations in Andhra Pradesh
      </h1>
      <div className="flex flex-wrap gap-[16px] w-full mb-4">
        {topDestinationsData.map((item, index) => (
          <div
            key={index}
            className="md:w-[162px] w-[130px] h-[43px] flex flex-row gap-[4px] justify-between items-center border-[1px] border-[#FF8B02] px-3 py-2 rounded-lg"
          >
            <span className="text-[#FF8B02] font-medium md:text-[14px] text-[10px]">
              {item.places}
            </span>
            <Image
              onClick={() =>
                Router.push(TravelGuideNonAuthRoutes.singlePlace + item.places)
              }
              className="cursor-pointer"
              src={ArrowRtIcon}
              alt={"Check Icon"}
            />
          </div>
        ))}
      </div>
      <h1 className="font-bold text-[#281D1B] lg:text-[30px] text-[18px] md:mb-[32px] mb-[16px]">
        Top destinations in Andhra Pradesh
      </h1>
      <div className="flex flex-wrap gap-[16px] w-full mb-4">
        {topDestinationsData.map((item, index) => (
          <div
            key={index}
            className="md:w-[162px] w-[130px] h-[43px] flex flex-row gap-[4px] justify-between items-center border-[1px] border-[#FF8B02] px-3 py-2 rounded-lg"
          >
            <span className="text-[#FF8B02] font-medium md:text-[14px] text-[10px]">
              {item.places}
            </span>
            <Image
              onClick={() =>
                Router.push(TravelGuideNonAuthRoutes.singlePlace + item.places)
              }
              className="cursor-pointer"
              src={ArrowRtIcon}
              alt={"Check Icon"}
            />
          </div>
        ))}
      </div>
      <h1 className="font-bold text-[#281D1B] lg:text-[30px] text-[18px] md:mb-[32px] mb-[16px]">
        Top destinations in Andhra Pradesh
      </h1>
      <div className="flex flex-wrap gap-[16px] w-full mb-4">
        {topDestinationsData.map((item, index) => (
          <div
            key={index}
            className="md:w-[162px] w-[130px] h-[43px] flex flex-row gap-[4px] justify-between items-center border-[1px] border-[#FF8B02] px-3 py-2 rounded-lg"
          >
            <span className="text-[#FF8B02] font-medium md:text-[14px] text-[10px]">
              {item.places}
            </span>
            <Image
              onClick={() =>
                Router.push(TravelGuideNonAuthRoutes.singlePlace + item.places)
              }
              className="cursor-pointer"
              src={ArrowRtIcon}
              alt={"Check Icon"}
            />
          </div>
        ))}
      </div>
      <h1 className="font-bold text-[#281D1B] lg:text-[30px] text-[18px] md:mb-[32px] mb-[16px]">
        Top destinations in Andhra Pradesh
      </h1>
      <div className="flex flex-wrap gap-[16px] w-full mb-4">
        {topDestinationsData.map((item, index) => (
          <div
            key={index}
            className="md:w-[162px] w-[130px] h-[43px] flex flex-row gap-[4px] justify-between items-center border-[1px] border-[#FF8B02] px-3 py-2 rounded-lg"
          >
            <span className="text-[#FF8B02] font-medium md:text-[14px] text-[10px]">
              {item.places}
            </span>
            <Image
              onClick={() =>
                Router.push(TravelGuideNonAuthRoutes.singlePlace + item.places)
              }
              className="cursor-pointer"
              src={ArrowRtIcon}
              alt={"Check Icon"}
            />
          </div>
        ))}
      </div>
      <h1 className="font-bold text-[#281D1B] lg:text-[30px] text-[18px] md:mb-[32px] mb-[16px]">
        Top destinations in Andhra Pradesh
      </h1>
      <div className="flex flex-wrap gap-[16px] w-full mb-4">
        {topDestinationsData.map((item, index) => (
          <div
            key={index}
            className="md:w-[162px] w-[130px] h-[43px] flex flex-row gap-[4px] justify-between items-center border-[1px] border-[#FF8B02] px-3 py-2 rounded-lg"
          >
            <span className="text-[#FF8B02] font-medium md:text-[14px] text-[10px]">
              {item.places}
            </span>
            <Image
              onClick={() =>
                Router.push(TravelGuideNonAuthRoutes.singlePlace + item.places)
              }
              className="cursor-pointer"
              src={ArrowRtIcon}
              alt={"Check Icon"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
