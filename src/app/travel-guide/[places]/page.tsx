"use client";

import React from "react";
import NavBar from '@/components/layout/navbar/NavBar';

import { Overview } from "./components/overview";
import { Facts } from "./components/facts";
import { PlacesToVisits } from "./components/places-to-visits";
import { Packages } from "./components/packages";
import { OtherPlaces } from "./components/other-places";

export default function TravelGuidePlacesPage() {
  return (
    <section>
      <NavBar />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 lg:mb-4 mb-4 md:mt-4 mt-2 lg:mx-[7%] mx-[4%]">
        <span className="text-carrot-orange font-semibold">Travel,</span>{" "}
        <span className="text-carrot-orange font-semibold">India,</span>{" "}
        <span className="text-carrot-orange font-semibold">Delhi</span>
      </div>
      <div className="flex flex-col gap-[32px] mb-4 lg:mx-[7%] mx-[4%] font-sans">
        <Overview />
        <Facts />
        <PlacesToVisits />
        <Packages />
        <OtherPlaces />
      </div>
    </section>
  );
}
