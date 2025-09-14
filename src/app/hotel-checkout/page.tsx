'use client';

import NavBar from '../../components/navbar/NavBar/navbar/NavBar';
import { Address } from './components/address';
import { Overview } from './components/overview';
import { Payments } from './components/payments';
import { TripPrice } from './components/trip-price';

export default function HotelCheckoutPage() {
  return (
    <section>
      <NavBar />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 lg:mb-16 mb-4 mt-2 lg:mx-[7%] mx-[4%]">
        <span>Home --&gt; Tours --&gt; Valley of Flowers --&gt; Booking --&gt;</span>{' '}
        <span className="text-carrot-orange font-semibold">Checkout</span>
      </div>
      <div className="flex lg:flex-row flex-col gap-[16px] mb-4 lg:mx-[7%] mx-[4%] font-sans">
        <div className="flex flex-col lg:gap-[32px] gap-[16px]">
          <Overview />
          <Address />
          <Payments />
        </div>
        <TripPrice />
      </div>
    </section>
  );
}
