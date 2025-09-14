import React from "react";

export function Payments() {
  return (
    <div className="flex flex-col gap-[40px] py-4">
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md"
        type="submit"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
