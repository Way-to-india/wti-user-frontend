import React from "react";

export function TripPrice() {
  return (
    <div className="lg:w-[30%] w-full h-full flex flex-col gap-[8px] font-sans border-[1px] border-[#ECECEC] rounded p-4">
      <strong className="text-[#262626] text-[12px] font-bold">
        TRIP PRICE
      </strong>
      <div className="flex flex-row justify-between gap-2 mt-2">
        <span className="text-[#707070] text-[15px]">2 nights Room Cost</span>{" "}
        <strong className="text-[#262626] text-[15px] font-bold">₹6,500</strong>
      </div>
      <div className="flex flex-row justify-between gap-2 mt-2">
        <span className="text-[#707070] text-[15px]">Tax</span>{" "}
        <strong className="text-[#262626] text-[15px] font-bold">₹500</strong>
      </div>
      <div className="flex flex-row justify-between gap-2 mt-2">
        <span className="text-[#707070] text-[15px]">Total</span>{" "}
        <strong className="text-[#262626] text-[15px] font-bold">₹7,200</strong>
      </div>

      <button className="p-2 bg-[#BABABA] text-white text-[16px] rounded font-bold mt-2">
        Book Now
      </button>
    </div>
  );
}
