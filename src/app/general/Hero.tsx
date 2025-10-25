import React, { useState } from 'react';
import ToursSearchTab from '@/components/features/search/ToursSearchTab';
import HotelSearchTab from '@/components/features/search/HotelSearchTab';
import TransportSearchTab from '@/components/features/search/TransportSearchTab';

const HeroPage = () => {
  const [selectedTab, setSelectedTab] = useState('tours');

  const tabs = [
    { id: 'tours', label: 'Tours/Packages' },
    { id: 'hotels', label: 'Hotels' },
    { id: 'transport', label: 'Transportation' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80')",
        }}
      ></div>


      <div className="absolute inset-0 bg-white/40"></div>


      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>


      <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">

        <div className="text-center mb-8 sm:mb-12 lg:mb-16 opacity-0 animate-fadeIn">
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


        <div className="max-w-6xl mx-auto opacity-0 animate-slideUp">

          <div className="flex justify-center mb-6 px-4">
            <div className="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-1.5 border border-white/20">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 lg:px-8 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${selectedTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'hotels' && 'Hotels'}
                    {tab.id === 'tours' && 'Tours'}
                    {tab.id === 'transport' && 'Transport'}
                  </span>
                </button>
              ))}
            </div>
          </div>


          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">

            {selectedTab === 'tours' && (
              <ToursSearchTab />
            )}


            {selectedTab === 'hotels' && (
              <HotelSearchTab />
            )}


            {selectedTab === 'transport' && (
              <TransportSearchTab />
            )}
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

export default HeroPage;