import React from "react";
import Image from "next/image";
import Destination from "@/assets/images/destination.png";
import { Calendar, User, ForkKnife } from "@phosphor-icons/react";

export function Overview() {
  return (
    <div className="flex flex-col gap-[32px] font-sans border-b-[1px] border-b-[#E1E1E1] pb-4">
      <div className="flex lg:flex-row flex-col gap-[16px] mb-[48px]">
        <Image
          className="w-full lg:w-[330px] rounded-md object-cover"
          src={Destination}
          alt={"Hotel"}
        />
        <div className="flex flex-col gap-[25px]">
          <h1 className="text-[24px] text-orange-500  font-bold">
            Standard Room x 1
          </h1>
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[12px] text-[#262626] underline decoration-orange-500 underline-offset-4 font-bold mb-2">
              STAY DETAILS
            </h3>
            <div className="flex flex-wrap gap-[16px]">
              <div className="flex flex-row gap-2 p-2 text-[#262626] text-[14px] items-center border-[1px] border-[#E1E1E1] rounded">
                <Calendar />
                <p>
                  Check In{" "}
                  <span className="text-orange-500 font-bold">
                    24th October 2024
                  </span>
                </p>
              </div>
              <div className="flex flex-row gap-2 p-2  text-[#262626] text-[14px] items-center border-[1px] border-[#E1E1E1] rounded">
                <Calendar />
                <p>
                  Check Out{" "}
                  <span className="text-orange-500 font-bold">
                    28th October 2024
                  </span>
                </p>
              </div>
              <div className="flex flex-row gap-2 p-2  text-[#262626] text-[14px] items-center border-[1px] border-[#E1E1E1] rounded">
                <User />
                <p>
                  No. of guests{" "}
                  <span className="text-orange-500 font-bold">2</span>
                </p>
              </div>
              <div className="flex flex-row gap-2 p-2  text-[#42A454] text-[14px] items-center border-[1px] border-[#42A454] rounded">
                <ForkKnife />
                <p>Only Breakfast</p>
              </div>
            </div>
            <div>
              <h3 className="text-[12px] text-[#262626] underline decoration-orange-500 underline-offset-4 font-bold mb-2">
                HOTEL DETAILS
              </h3>
              <h3 className="text-[24px] text-[#262626] font-bold mb-2">
                Sherpa Hotel
              </h3>
              <a
                href="https://www.google.com/maps/place//data=!4m2!3m1!1s0x39090d0c85d21e7d:0x85b8c163321fb639?sa=X&ved=1t:8290&ictx=111"
                target="_blank"
                className="text-[#707070] text-[16px] underline decoration-[#707070] underline-offset-4 font-bold"
              >
                National Highway 58, Singtali, Byasi, Uttarakhand 249192, India
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
