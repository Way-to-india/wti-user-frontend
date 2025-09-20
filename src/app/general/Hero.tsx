import React from 'react';
import Image from 'next/image';
import IndianHeritage from '@/assets/images/indian_building_scene.png';
import SearchSection from '@/app/general/SearchSection';

const HeroPage: React.FC = () => {
  return (
    <section className="relative h-[600px] sm:h-[700px] md:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={IndianHeritage}
          alt="Indian Heritage"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-carrot-orange/20 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 font-limeLight leading-tight">
            Come, Explore the incredible{' '}
            <span className="block">land</span>
          </h1>
        </div>

        <div className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20">
          <SearchSection />
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
