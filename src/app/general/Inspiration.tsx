"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowCircleLeft, ArrowCircleRight } from "@phosphor-icons/react";
import Bridge from "../../../public/assets/images/inspiration.png";
import {
  getInspirationalTours
} from "@/services/inspirationService";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

interface ThemeGroup {
  id : string;
  name : string;
  tours : any[]
}

const Inspiration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [themeGroups, setThemeGroups] = useState<ThemeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchInspirationalTours();
  },[]);

  const fetchInspirationalTours = async () => {
    try {
      setIsLoading(true);
      const response = await getInspirationalTours();

      if (response.success && response.data) {
        const groups = response.data;
        setThemeGroups(groups);
        // Set the first theme as the selected tab
        if (groups.length > 0) {
          setSelectedTab(groups[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching inspirational tours:", error);
      // Fall back to static data
      setThemeGroups([
        {
          id: "winter",
          name: "Winter Tours",
          tours: winterTours,
        },
        {
          id: "summer",
          name: "Summer Holiday",
          tours: summerHoliday,
        },
        {
          id: "luxury",
          name: "Luxury Hotels",
          tours: luxuryHotels,
        },
        {
          id: "culture",
          name: "Cultural Tours",
          tours: culturalTours,
        },
      ]);
      setSelectedTab("Winter Tours");
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data
  // Winter Tours data
  const winterTours = [
    {
      id: "w1",
      title: "Rajasthan Tour Packages",
      description:
        "Rajasthan Tour Package as the name itself suggests, provides you all wonderful experiences that Rajasthan offers. Forts, Palaces, Cenotaphs, Havelis, Desert, Folk performances, Lakes and much more.",
      url: "/",
    },
    {
      id: "w2",
      title: "Golden Triangle Tour With Varanasi",
      description:
        "Golden Triangle Tour With Varanasi. A tour that takes the travelers through some of the most culturally vibrant cities of India. The cities that the travelers visit in this Tour are rich in cultural and historical significance.",
      url: "/",
    },
    {
      id: "w3",
      title: "Himachal Holiday Tour Package",
      description:
        "The Himachal holiday tour package takes you to visit the paradise of Himachal Pradesh. It gives you an experience of the very famous destinations of Manali and Shimla.",
      url: "/",
    },
  ];

  // Summer Holiday data
  const summerHoliday = [
    {
      id: "s1",
      title: "Goa Beach Vacation",
      description:
        "Relax on the beautiful beaches of Goa with sun, sand, and sea.",
      url: "/",
    },
    {
      id: "s2",
      title: "Kerala Backwaters Tour",
      description:
        "Enjoy the calm and serene backwaters of Kerala with houseboat stays.",
      url: "/",
    },
    {
      id: "s3",
      title: "Leh-Ladakh Adventure",
      description:
        "Discover the rugged beauty of Leh-Ladakh with this adventure-filled tour.",
      url: "/",
    },
  ];

  // Luxury Hotels data
  const luxuryHotels = [
    {
      id: "l1",
      title: "Royal Rajasthan Palace Stay",
      description:
        "Experience royal living in converted palace hotels across Rajasthan.",
      url: "/",
    },
    {
      id: "l2",
      title: "Kashmir Luxury Houseboat",
      description:
        "Stay in luxurious houseboats on Dal Lake with personalized service.",
      url: "/",
    },
    {
      id: "l3",
      title: "Goa Beach Resort Package",
      description:
        "Enjoy 5-star beach resorts with private beaches in Goa.",
      url: "/",
    },
  ];

  // Cultural Tours data
  const culturalTours = [
    {
      id: "c1",
      title: "Heritage Walk Varanasi",
      description:
        "Explore the ancient streets and ghats of Varanasi with expert guides.",
      url: "/",
    },
    {
      id: "c2",
      title: "South India Temple Tour",
      description:
        "Visit magnificent temples in Tamil Nadu and Kerala with cultural insights.",
      url: "/",
    },
    {
      id: "c3",
      title: "Buddhist Circuit Tour",
      description:
        "Follow the footsteps of Buddha through significant Buddhist sites in India.",
      url: "/",
    },
  ];

  // Get active tours based on selected tab
  const getActiveTours = () => {
    const activeTheme = themeGroups.find((group) => group.name === selectedTab);
    return activeTheme?.tours || [];
  };

  const handleViewDetails = (tourUrl: string) => {
    router.push(tourUrl);
  };

  return (
    <>
      <div className="px-4 md:px-10 my-4 justify-center items-center">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold py-4 md:py-6">
            Travel Inspiration
          </div>
         
          <div className="flex gap-2">
            <ArrowCircleLeft
              size={45}
              weight="light"
              color="#FF8B02"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <ArrowCircleRight
              size={45}
              weight="light"
              color="#FF8B02"
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </div>
        </div>

       
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <CircularProgress sx={{ color: "#FF8B02" }} />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
              {themeGroups.map((group) => (
                <button
                  key={group.id}
                  className={`px-4 py-2 rounded-full text-sm md:text-base font-firaSans ${
                    selectedTab === group.name
                      ? "bg-[#FF8B02] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setSelectedTab(group.name)}
                >
                  {group.name}
                </button>
              ))}
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getActiveTours().map((tour, index) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={Bridge}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {tour.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {tour.description}
                    </p>
                    <button
                      className="bg-[#FF8B02] text-white px-4 py-2 rounded-md text-sm hover:bg-[#E67E00] transition-colors"
                      onClick={() => handleViewDetails(tour.url)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Inspiration;
