import { ApiResponse } from '@/types/apiResponse';

export const handleApiCall = async <T>(
  apiCall: () => Promise<any>,
  defaultSuccessMessage = 'Request successful'
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    console.log('API response:', response?.data);
    return {
      data: response?.data?.payload ?? null,
      message: response?.data?.payload.message ?? defaultSuccessMessage,
      statusCode: response?.status ?? 200,
      success: true,
    };
  } catch (error: any) {
    console.error('API error:', error?.response?.data || error.message);
    return {
      data: null,
      message: error?.response?.data?.message || error.message || 'Something went wrong',
      statusCode: error?.response?.status || 500,
      success: false,
      error: error?.response || error,
    };
  }
};
