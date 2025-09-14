"use client"; // This component should be client-side
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Howard from "../../../public/assets/images/Frame 907.png";
import Phoenix from "../../../public/assets/images/Frame 908.png";
import Radha from "../../../public/assets/images/Frame 909.png";
import Royal from "../../../public/assets/images/Frame 911.png";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { getHotels } from "@/services/hotelService";
import { CircularProgress } from "@mui/material";
import { StaticImageData } from "next/image";

interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  imageUrl?: string;
}

interface HotelImageMap {
  [key: number]: StaticImageData;
  default: StaticImageData;
}

const Trending: React.FC = () => {
  const Router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeButton, setActiveButton] = useState("right");
  const [isLoading, setIsLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);

  // Fallback image map for hotels with proper typing
  const hotelImages: HotelImageMap = {
    0: Phoenix,
    1: Howard,
    2: Radha,
    3: Royal,
    4: Phoenix,
    default: Royal,
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setIsLoading(true);
      // Fetch hotels with a limit of 10 for trending hotels
      const response = await getHotels({ limit: 10 });
      console.log("Fetched hotels:", response);
      if (response.success && response.data) {
        const hotelData = Array.isArray(response.data.hotels)
          ? response.data.hotels.map((hotel: any, index: number) => ({
              id: hotel.id,
              name: hotel.name,
              // location: hotel?.location || "India",
              image: hotel.image || hotel.imageUrl || "",
              imageUrl: hotel.imageUrl || hotel.image || "",
            }))
          : [];
        setHotels(hotelData);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create image sets from fetched hotels
  const createImageSets = () => {
    if (hotels.length === 0) {
      // Return default image sets if no hotels
      return imageSetsDefault;
    }

    // Create sets with hotels for carousel
    const sets = [];
    for (let i = 0; i < Math.min(3, Math.ceil(hotels.length / 5)); i++) {
      const startIdx = i * 5;
      const firstRowItems = hotels
        .slice(startIdx, startIdx + 3)
        .map((hotel, idx) => {
          const imgIndex = (startIdx + idx) % 5 as keyof HotelImageMap;
          return {
            src:
              hotel.image || hotel.imageUrl
                ? { src: hotel.image || hotel.imageUrl }
                : hotelImages[imgIndex] || hotelImages.default,
            desc: hotel.name,
            link: `/hotels/${hotel.id}`,
            location: hotel?.location,
          };
        });

      const secondRowItems = hotels
        .slice(startIdx + 3, startIdx + 5)
        .map((hotel, idx) => {
          const imgIndex = (startIdx + 3 + idx) % 5 as keyof HotelImageMap;
          return {
            src:
              hotel.image || hotel.imageUrl
                ? { src: hotel.image || hotel.imageUrl }
                : hotelImages[imgIndex] || hotelImages.default,
            desc: hotel.name,
            link: `/hotels/${hotel.id}`,
            location: hotel?.location,
          };
        });

      sets.push({
        firstRow: firstRowItems,
        secondRow: secondRowItems,
      });
    }

    // If we don't have enough hotels, fill with defaults
    while (sets.length < 3) {
      sets.push(imageSetsDefault[sets.length]);
    }

    return sets;
  };

  // Default image sets as fallback
  const imageSetsDefault = [
    {
      firstRow: [
        {
          src: Phoenix,
          desc: "Phoenix Park Inn Resort",
          link: "/hotel-details",
          location: "Goa",
        },
        {
          src: Howard,
          desc: "Howard Sarovar Portico",
          link: "#",
          location: "Agra",
        },
        {
          src: Radha,
          desc: "Radha Hometel",
          link: "#",
          location: "Bangalore",
        },
      ],
      secondRow: [
        {
          src: Royal,
          desc: "Royal Park Resort",
          link: "#",
          location: "Manali",
        },
        { src: Royal, desc: "Best Western", link: "#", location: "Amritsar" },
      ],
    },
    {
      firstRow: [
        { src: Royal, desc: "Royal Stay", link: "#", location: "Delhi" },
        { src: Radha, desc: "Radha Palace", link: "#", location: "Mumbai" },
        { src: Phoenix, desc: "Phoenix Hotel", link: "#", location: "Jaipur" },
      ],
      secondRow: [
        { src: Howard, desc: "Howard Hotel", link: "#", location: "Chennai" },
        { src: Royal, desc: "Royal Stay", link: "#", location: "Kolkata" },
      ],
    },
    {
      firstRow: [
        { src: Howard, desc: "Howard Hotel", link: "#", location: "Hyderabad" },
        { src: Phoenix, desc: "Phoenix Hotel", link: "#", location: "Pune" },
        {
          src: Radha,
          desc: "Radha Palace",
          link: "#",
          location: "Ahmedabad",
        },
      ],
      secondRow: [
        { src: Royal, desc: "Radha Palace", link: "#", location: "Kochi" },
        { src: Royal, desc: "Royal Stay", link: "#", location: "Udaipur" },
      ],
    },
  ];

  const imageSets = isLoading ? imageSetsDefault : createImageSets();

  const handleNext = () => {
    if (activeIndex < imageSets.length - 1) {
      setActiveIndex(activeIndex + 1);
      setActiveButton("right");
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setActiveButton("left");
    }
  };

  const handleHotelClick = (link: string) => {
    Router.push(link);
  };

  return (
    <div className="p-4 md:p-10 my-4 justify-center items-center">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold pb-2 md:pb-0">
          Trending Hotels and Stays
        </div>
        <div className="flex gap-2">
          <ArrowCircleLeft
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              activeIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handlePrev}
          />
          <ArrowCircleRight
            size={45}
            weight="light"
            color="#FF8B02"
            className={`cursor-pointer ${
              activeIndex === imageSets.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleNext}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <CircularProgress sx={{ color: "#FF8B02" }} />
        </div>
      ) : (
        <div className="grid gap-4 md:gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imageSets[activeIndex].firstRow.map((item, index) => (
              <div
                key={index}
                className="relative h-56 cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
                onClick={() => handleHotelClick(item.link)}
              >
                <Image
                  src={item.src}
                  alt={item.desc}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-xl drop-shadow-lg">
                    {item.location}
                  </h3>
                  <p className="text-sm drop-shadow-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageSets[activeIndex].secondRow.map((item, index) => (
              <div
                key={index}
                className="relative h-56 cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden"
                onClick={() => handleHotelClick(item.link)}
              >
                <Image
                  src={item.src}
                  alt={item.desc}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h3 className="font-bold text-xl drop-shadow-lg">
                    {item.location}
                  </h3>
                  <p className="text-sm drop-shadow-md">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Trending;
