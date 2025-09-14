import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image"
import IndianHeritage from "@/assets/images/indian_building_scene.png"
import SearchSection from "@/app/general/SearchSection";
import { useTheme } from "@/context/ThemeContext";

const HeroPage = () => {
    const theme = useTheme();

    return (
        <div className="relative h-[800px] w-full overflow-hidden">
            {/* Orange overlay div */}
            <div>
                <div className="absolute inset-0" style={{ backgroundColor: theme.colors.carrotOrange, opacity: 0.2, zIndex: 10 }} />                {/* Image component */}
                <Image
                    src={IndianHeritage}
                    alt="Indian Heritage"
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    className="z-0"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Content overlay */}
            <div className="relative z-20 flex flex-col items-start justify-center h-full p-4 md:p-10">
                {/* Heading text */}
                <h2 className="text-4xl md:text-6xl font-bold mb-4 md:ml-[5rem]" style={{
                    color: theme.colors.milkWhite,
                    fontFamily: theme.typography.fontFamily.bold,
                    fontSize: theme.typography.fontSize.primaryHeading
                }}>
                    Come, Explore the incredible land
                </h2>
                {/* Search Section */}
                <div className="mt-8 md:mt-[5rem] w-full">
                    <SearchSection />
                </div>
            </div>
        </div>
    );
};

export default HeroPage;