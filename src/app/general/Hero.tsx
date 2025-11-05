import React, { useState } from 'react';
import ToursSearchTab from '@/components/features/search/ToursSearchTab';
import HotelSearchTab from '@/components/features/search/HotelSearchTab';
import TransportSearchTab from '@/components/features/search/TransportSearchTab';
import Image from 'next/image';
import styles from '@/styles/HeroPage.module.css';

const HeroPage = () => {
  const [selectedTab, setSelectedTab] = useState('tours');

  const tabs = [
    { id: 'tours', label: 'Tours/Packages', shortLabel: 'Tours' },
    { id: 'hotels', label: 'Hotels', shortLabel: 'Hotels' },
    { id: 'transport', label: 'Transportation', shortLabel: 'Transport' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero-image.jpeg"
          alt="Travel destination background"
          fill
          priority
          quality={75}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-white/40"></div>


      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`}></div>
        <div className={`${styles.blob} ${styles.blob2}`}></div>
        <div className={`${styles.blob} ${styles.blob3}`}></div>
      </div>


      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">

        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 ${styles.fadeIn}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Come, Explore the
            <span className="block mt-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Incredible Land
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover breathtaking destinations, create unforgettable memories
          </p>
        </div>


        <div className={`max-w-6xl mx-auto ${styles.slideUp}`}>

          <div className="flex justify-center mb-6 px-4">
            <div
              className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-1.5 border border-white/20"
              role="tablist"
              aria-label="Search options"
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  role="tab"
                  aria-selected={selectedTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                  className={`flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${selectedTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>


          <div
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20"
            role="tabpanel"
            id={`${selectedTab}-panel`}
            aria-labelledby={`${selectedTab}-tab`}
          >
            {selectedTab === 'tours' && <ToursSearchTab />}
            {selectedTab === 'hotels' && <HotelSearchTab />}
            {selectedTab === 'transport' && <TransportSearchTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;