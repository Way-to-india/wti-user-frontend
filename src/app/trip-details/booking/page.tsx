'use client';
import NavBar from '@/components/layout/navbar/NavBar';
import Footer from '@/components/layout/Footer';
import placeholderImage from '@/assets/images/destination.png';
import Box from '@mui/material/Box';
import BookingCard from '../../../components/BookingsScreen/BookingCard';
import Checkout from '../../../components/BookingsScreen/Checkout';
import HotelDetails from '../../../components/BookingsScreen/HotelsDetails';
import TransportationDetails from '../../../components/BookingsScreen/TransportationDetails';
import TravelDetails from '../../../components/BookingsScreen/TravelDetails';

const placeHolder = {
  image: placeholderImage,
  hotelName: 'Sherpa hotel',
  star: '4',
  dest: 'Rishikesh',
  rating: '4.5',
  roomNumber: '2',
  description:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos dicta perferendis laudantium.',
  price: 2500,
};

const BookingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <NavBar />
      <Box className="mx-20">
        <BookingCard />
        <div className="mt-12">
          <TravelDetails />
          <HotelDetails prop={placeHolder} />
          <TransportationDetails />
        </div>
        <Checkout />
      </Box>
      <Footer bannerDisplayed="enquire" />
    </div>
  );
};

export default BookingPage;
