import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { fetchTours } from '@/app/redux/toursSlice';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const useToursData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchToursWithRetry = async (params: any, retries = 0): Promise<void> => {
    try {
      await dispatch(fetchTours(params)).unwrap();
      setRetryCount(0);
      setIsRetrying(false);
    } catch (error: any) {
      console.error(`Fetch attempt ${retries + 1} failed:`, error);

      const isTimeoutError =
        error?.message?.includes('timeout') ||
        error?.message?.includes('exceeded') ||
        error?.code === 'ECONNABORTED';

      if (retries < MAX_RETRIES && isTimeoutError) {
        setRetryCount(retries + 1);
        setIsRetrying(true);
        const delay = RETRY_DELAY * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying... (${retries + 1}/${MAX_RETRIES})`);
        return fetchToursWithRetry(params, retries + 1);
      } else {
        setIsRetrying(false);
        throw error;
      }
    }
  };

  return { fetchToursWithRetry, retryCount, isRetrying };
};
