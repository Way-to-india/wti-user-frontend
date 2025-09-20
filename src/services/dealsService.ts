import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';

export interface Deal {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  code?: string;
  validUntil?: string;
  image?: string;
}

export const getDeals = async (): Promise<ApiResponse<Deal[]>> => {
  try {
    const response = await handleApiCall(
      async () => axios.get(endpoints.deals?.getAll || '/api/deals'), 
      "Deals fetched successfully"
    );

    if (response.success && response.data) {
      return response as any;
    }

    // If no data from API or API doesn't exist yet, return fallback data
    return {
      success: true,
      message: "Using fallback deals data",
      data: getFallbackDeals()
    };
  } catch (error) {
    console.error("Error fetching deals:", error);
    
    // Return fallback data in case of error
    return {
      success: true,
      message: "Using fallback deals data due to error",
      data: getFallbackDeals()
    };
  }
};

// Fallback deals data
const getFallbackDeals = (): Deal[] => [
  {
    id: "1",
    title: "First Time Air Charter",
    description: "Get 20% off on your first Air Charter Tour Package!!",
    discountPercentage: 20,
    code: "FIRST20",
    validUntil: "2025-12-31"
  },
  {
    id: "2",
    title: "Summer Special",
    description: "15% discount on all summer packages to Goa and Kerala",
    discountPercentage: 15,
    code: "SUMMER15",
    validUntil: "2025-08-31"
  },
  {
    id: "3",
    title: "Early Bird Booking",
    description: "10% off on advanced bookings made 60 days before travel",
    discountPercentage: 10,
    code: "EARLY10",
    validUntil: "2025-12-31"
  }
];
