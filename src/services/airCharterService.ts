import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { transportTypes } from './transportService';

export interface AirCharterTour {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string;
  price?: number;
  duration?: string;
  fromLocation?: string;
  toLocation?: string;
}

// Function to get helicopter type air charters from tours or transport API
export const getAirCharterTours = async (limit: number = 6): Promise<ApiResponse<AirCharterTour[]>> => {
  try {
    // First try to get helicopter tours from transport API (if available)
    const transportResponse = await handleApiCall(
      async () => axios.get(`${endpoints.transport?.getAll || '/api/transport'}?type=helicopter&limit=${limit}`), 
      "Air charter tours fetched successfully"
    );

    if (transportResponse.success && Array.isArray(transportResponse.data) && transportResponse.data.length > 0) {
      return transportResponse;
    }

    // If no helicopter transports, try to get helicopter-tagged tours
    const toursResponse = await handleApiCall(
      async () => axios.get(`${endpoints.tours.getTours}?tag=helicopter&limit=${limit}`), 
      "Air charter tours fetched successfully"
    );

    if (toursResponse.success && toursResponse.data) {
      return toursResponse;
    }

    // If no data from API, return fallback data
    return {
      success: true,
      message: "Using fallback air charter data",
      data: getFallbackAirCharters()
    };
  } catch (error) {
    console.error("Error fetching air charter tours:", error);
    
    // Return fallback data in case of error
    return {
      success: true,
      message: "Using fallback air charter data due to error",
      data: getFallbackAirCharters()
    };
  }
};

// Fallback data for air charter tours
const getFallbackAirCharters = (): AirCharterTour[] => [
  {
    id: "1",
    title: "Badrinath Yatra By Helicopter  [1Nights / 2 Days]",
    description: "Experience a sacred journey to Badrinath in comfort with our helicopter service. Includes accommodation and guided temple visit.",
    imageUrl: "/assets/images/inspiration.png",
    price: 155000,
    duration: "2 Days",
    fromLocation: "Dehradun",
    toLocation: "Badrinath"
  },
  {
    id: "2",
    title: "Bandhavgarh Wildlife Safari Tour From Ahmedabad  [3Nights / 4 Days]",
    description: "Explore the wildlife of Bandhavgarh with an aerial view. Perfect for photography enthusiasts and nature lovers.",
    imageUrl: "/assets/images/inspiration.png",
    price: 235000,
    duration: "4 Days",
    fromLocation: "Ahmedabad",
    toLocation: "Bandhavgarh"
  },
  {
    id: "3",
    title: "Srinagar To Amarnath Helicopter  [0Nights / 1 Days]",
    description: "A quick day trip from Srinagar to the sacred Amarnath cave. Avoid the long trek with our convenient helicopter service.",
    imageUrl: "/assets/images/inspiration.png",
    price: 85000,
    duration: "1 Day",
    fromLocation: "Srinagar",
    toLocation: "Amarnath"
  }
];
