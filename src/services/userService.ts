import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';

export const getUserProfileById = async (id: string): Promise<ApiResponse<any>> => {
  return handleApiCall(async () => axios.get(endpoints.user.profileById(id)), "User profile fetched successfully");
};
