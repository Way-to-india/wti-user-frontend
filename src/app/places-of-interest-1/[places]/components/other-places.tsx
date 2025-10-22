import React from "react";
import Image from "next/image";
import Places from "@/assets/images/mosque.svg";

export function OtherPlaces() {
  return (
    <div>
      <h1 className="font-bold text-[#281D1B] lg:text-[32px] text-[20px] md:mb-[32px] mb-[16px] pt-4 border-t-[1px] border-t-[#FFE2C1] pb-4">
        Other places of interest in Andaman & Nicobar Island
      </h1>
      <div className="flex gap-6 overflow-x-auto scrollbar-hide p-2 w-full">
        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>

        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>

        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>

        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>

        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>

        <div className="relative flex-shrink-0 w-[402px] h-[100%] shadow-md rounded-[30px]">
          <Image
            className="w-full h-[255px] rounded-[30px] object-cover"
            src={Places}
            alt={"Places"}
          />
          <div className="mt-2 flex flex-col gap-[8px] p-4">
            <h3 className="text-[#281D1B] text-[16px] font-semibold text-wrap">
              A Day in the Life of a Delhi Street Food Vendor
            </h3>
            <p className="text-[#FF8B02] text-[13px] text-wrap">
              Travel, Japan
            </p>
            <small className="text-[#2E1914] text-[13px] text-wrap">
              Top 10 Street Food Delights in Delhi
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
