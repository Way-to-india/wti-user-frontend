'use client';
import Footer from '@/components/Footer';
import { CalendarBlank, CurrencyInr, User } from '@phosphor-icons/react';
import Image from 'next/image';
import Bridge from '../../../../public/assets/images/inspiration.png';
import BreadcrumbNav from '../../../components/details-page/Breadcrumb-Nav';
import NavBar from '../../../components/navbar/NavBar/navbar/NavBar';
import Address from './AddressDetails';
import CardDetails from './CardDetails';

const TourCheckout = () => {
  const breadcrumbs = [
    { href: '/', text: 'Home' },
    { href: '/tours', text: 'Tours' },
    { href: '/', text: 'Valley of Flowers' },
    { href: '/', text: 'Booking' },
  ];

  const currentTitle = 'Checkout';
  return (
    <div className="relative min-h-screen">
      <NavBar />
      {/* Main contents */}
      <div className="container mx-auto  mt-4">
        <div className="grid grid-cols-12 p-8">
          <div className="col-span-12 ">
            <BreadcrumbNav breadcrumbs={breadcrumbs} currentTitle={currentTitle} />
          </div>
          <div className="col-span-9 grid grid-cols-9 mt-8 border-b-2 pb-4 gap-2">
            {/* tripimage */}
            <div className="col-span-3 flex justify-center items-center">
              <Image src={Bridge} className="w-64 h-64 rounded" alt="placeholder img" />
            </div>
            {/* tripdetails */}

            <div className="col-span-6">
              <div>
                <div className="text-xl font-bold text-[#FF8B02]">Valley Of flowers</div>
                <div className="my-4">
                  <div className="underline decoration-[#FF8B02] underline-offset-8 decoration-2 font-bold text-xs my-2 mb-3 tracking-widest">
                    Travel details
                  </div>
                  <div className="flex items-center gap-6 text-sm font-bold">
                    <div className="flex items-center gap-1 ">
                      <CalendarBlank />
                      24th Oct 2024
                    </div>
                    <div className="flex items-center gap-1">
                      <User />2
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarBlank />
                      Rishikesh
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <div className="underline decoration-[#FF8B02] underline-offset-8 decoration-2 font-bold text-xs my-2 mb-3 tracking-widest">
                    Hotel details
                  </div>
                  <div className="text-xl font-bold">Sherpa Hotel</div>
                  <div className="text-sm text-[#707070]">Standard room x 1</div>
                </div>
                <div className="my-4">
                  <div className="underline decoration-[#FF8B02] underline-offset-8 decoration-2 font-bold text-xs my-2 mb-3 tracking-widest">
                    Transportation details
                  </div>
                  <div className="font-bold text-sm">Public Transport</div>
                  <div className="text-sm text-[#707070]">
                    Volvo Sleeper Bus, Pick up from Kashmere Gate
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* tripprice */}
          <div className="col-span-3 my-8 px-4">
            <div className="border border-[#707070] p-4 rounded-lg">
              <div className="decoration-2 font-bold text-xs tracking-widest mb-6">TRIP PRICE</div>
              <div className="text-sm text-[#707070] mb-6">
                <div className="flex justify-between my-2">
                  <p>Trip Cost</p>
                  <p className="font-bold text-black flex items-center">
                    <CurrencyInr />
                    6500
                  </p>
                </div>
                <div className="flex justify-between my-2">
                  <p>Upgrade: Private Car</p>
                  <p className="font-bold text-black flex items-center">
                    <CurrencyInr />
                    1200
                  </p>
                </div>
                <div className="flex justify-between my-2">
                  <p>Tax</p>
                  <p className="font-bold text-black flex items-center">
                    <CurrencyInr />
                    500
                  </p>
                </div>
                <div className="flex justify-between my-2">
                  <p>Total</p>
                  <p className="font-extrabold text-black flex items-center">
                    <CurrencyInr />
                    8200
                  </p>
                </div>
              </div>
              <div className=" p-2 cursor-pointer rounded-md flex items-center justify-center bg-[#BABABA] text-white font-bold ">
                Book Now
              </div>
            </div>
          </div>
          <div className="col-span-9">
            <Address />
            <CardDetails />
          </div>
        </div>
      </div>
      <Footer bannerDisplayed="enquire" />
    </div>
  );
};

export default TourCheckout;
