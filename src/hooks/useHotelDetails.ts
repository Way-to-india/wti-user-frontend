import { useState, useEffect } from 'react';
import { City, Hotel, SimilarHotel } from '@/types/hotel';
import { getCityById, getHotelById, getSimilarHotels } from '@/services/hotelService';

export const useHotelDetails = (hotelId: string) => {
  const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
  const [cityDetails, setCityDetails] = useState<City | null>(null);
  const [similarHotels, setSimilarHotels] = useState<SimilarHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await getHotelById(hotelId);

        if (response.success && response.data) {
          const hotel = response.data;
          setHotelDetails(hotel);

          if (hotel.location?.address?.cityId) {
            // Fetch city and similar hotels
            await Promise.allSettled([
              fetchCityDetails(String(hotel.location.address.cityId)),
              fetchSimilarHotels(String(hotel.location.address.cityId), hotelId),
            ]);
          }
        } else {
          setError('Failed to fetch hotel details');
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Error fetching hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCityDetails = async (cityId: string) => {
      try {
        const cityResponse = await getCityById(cityId);
        if (cityResponse.success && cityResponse.data) {
          setCityDetails(cityResponse.data);
        }
      } catch (error) {
        console.error('Error fetching city details:', error);
      }
    };

    const fetchSimilarHotels = async (cityId: string, currentHotelId: string) => {
      try {
        const response = await getSimilarHotels(cityId, currentHotelId);
        if (response.success && response.data) {
          const hotelsArray = Array.isArray(response.data)
            ? response.data
            : response.data.hotels || [];
          setSimilarHotels(hotelsArray);
        }
      } catch (error) {
        console.error('Error fetching similar hotels:', error);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  return { hotelDetails, cityDetails, similarHotels, loading, error };
};
