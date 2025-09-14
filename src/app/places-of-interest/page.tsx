'use client';

import NavBar from '../../components/navbar/NavBar/navbar/NavBar';
import { Overview } from './components/overview';
import { TopDestinations } from './components/top-destinations';

export default function PlacesOfInterestPage() {
  return (
    <section>
      <NavBar />
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 lg:mb-16 mb-4 md:mt-4 mt-2 lg:mx-[7%] mx-[4%]">
        <span>Home --&gt;</span>{' '}
        <span className="text-carrot-orange font-semibold cursor-pointer">Places of Interest</span>
      </div>
      <div className="flex flex-col gap-[32px] mb-4 lg:mx-[7%] mx-[4%] font-sans">
        <Overview />
        <TopDestinations />
      </div>
    </section>
  );
}
