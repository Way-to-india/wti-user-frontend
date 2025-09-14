import axios from '@/api/axios';
import endpoints from '@/api/endpoints';

export const login = async () => {
  const response = await axios.get(endpoints.auth.login);
  return response?.data?.data;
};
