"use client";

import React from "react";
import NavBar from "@/app/components/navbar/NavBar/navbar/NavBar";
import { Overview } from "./components/overview";
import { OtherPlaces } from "./components/other-places";

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
