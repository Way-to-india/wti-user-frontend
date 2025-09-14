import React, { useEffect, useState } from "react";

export function Address() {
  const [travelerDetails, setTravelerDetails] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem("travelerDetails");

    // Parse and set the data if it exists
    if (savedDetails) {
      setTravelerDetails(JSON.parse(savedDetails));
    }
  }, []);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setTravelerDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };

  return (
    <div className="text-[#000000] lg:pb-[32px] pb-[16px] border-b-[1px] border-b-[#E1E1E1]">
      <h1 className="text-[20px] font-bold">Home Address</h1>
      <p className="text-[14px] mb-4">
        For safety purpose we require your address
      </p>
      <div className="flex lg:flex-row flex-col gap-[16px] justify-between mb-4">
        <div className="w-full">
          <label htmlFor="firstname" className="font-bold text-[14px]">
            Full Name*
          </label>
          <input
            type="text"
            id="fullName"
            value={travelerDetails.fullName}
            onChange={handleInputChange}
            placeholder="Enter your Full Name"
            className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]"
          />
        </div>
        {/* <div className="w-full">
          <label htmlFor="lastname" className="font-bold text-[14px]">
            Last name*
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter your last name"
            className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]"
          />
        </div> */}
      </div>
      <div>
        <label htmlFor="address" className="font-bold text-[14px]">
          Email Address*
        </label>
        <div>
          <input
            type="text"
            id="address"
            value={travelerDetails.email}
            onChange={handleInputChange}
            placeholder="Enter your Email Address"
            className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]"
          />
        </div>
        <small className="font-bold text-[12px] text-orange-500">
          Add address line
        </small>
      </div>
      <div className="flex lg:flex-row flex-col gap-[16px] justify-between mb-4">
        <div className="w-full">
          <label htmlFor="city" className="font-bold text-[14px]">
            City*
          </label>
          <input
            type="text"
            id="city"
            placeholder="Enter your City"
            className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]"
          />
        </div>
        <div className="w-full">
          <label htmlFor="zipcode" className="font-bold text-[14px]">
            Zip code*
          </label>
          <input
            type="text"
            id="zipcode"
            placeholder="Enter your Zip code"
            className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]"
          />
        </div>
      </div>
      <div>
        <label htmlFor="stateProvince" className="font-bold text-[14px]">
          State / Province*
        </label>
        <div>
          <select className="w-full outline-none border-[1px] border-[#E1E1E1] rounded-md p-2 text-[14px]">
            <option value="" selected disabled className="text-[#707070]">
              Select State / Province{" "}
            </option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Bihar">Bihar</option>
            <option value="Jharkhand">Jharkhand</option>
          </select>
        </div>
      </div>
    </div>
  );
}
