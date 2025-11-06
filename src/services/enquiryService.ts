import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';

export interface TourEnquiry {
  tourId: string;
  tourName: string;
  name: string;
  email: string;
  phoneNumber: string;
  numberOfPeople: number;
  travelDate?: string;
  departureCity?: string;
  specialRequests?: string;
}

export const submitTourEnquiry = async (enquiryData: TourEnquiry) => {
  return handleApiCall(
    async () => axios.post(endpoints.tours.submitEnquiry, enquiryData),
    "Enquiry submitted successfully"
  );
};
