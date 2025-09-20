"use client";

import React from "react";
import { Overview } from "./components/overview";
import { OtherPlaces } from "./components/other-places";
import NavBar from '@/components/layout/navbar/NavBar';


export default function SinglePlacesOfInterestPage() {
  return (
    <section>
      <NavBar /> 
      <div className="flex flex-col gap-[32px] mb-4 lg:mx-[7%] mx-[4%] font-sans">
        <Overview />
        <OtherPlaces />
      </div>
    </section>
  );
}
