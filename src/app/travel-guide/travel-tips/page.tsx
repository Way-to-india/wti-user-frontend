import React from 'react';
import NavBar from '@/components/layout/navbar/NavBar';

export default function TravelTipsPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="text-sm text-gray-600">
          <span className="hover:text-orange-500 cursor-pointer">Home</span>
          <span className="mx-2">»</span>
          <span className="text-gray-900">Travel Tips</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Common Travel Safety Issues and How to Avoid Them
        </h1>

        <p className="text-gray-700 leading-relaxed mb-8 text-justify">
          Problems may be unavoidable if you are not cautious about the probable traps while
          travelling through a new location. In the excitement of exploring some wonderful
          attractions and activities, don't miss on the safety guidelines that can actually add
          value to your travel and holiday experience. Here are some of these safety tips clubbed
          together for your convenience:
        </p>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Keep Your Money and Cards Safe</h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            The cash or cards you carry on a trip are prone to loss and theft. You would certainly
            not want to run out of money or dilute the pleasure by landing into such situations.
            Avoid it with the following tips:
          </p>

          <ul className="space-y-4 ml-6">
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Avoid Back Pockets for Wallets:</span> Do
              you know how to keep your bank cards in your purse or wallet? Well stay away from this
              habit while you are on a trip. Keep at least separate places. Imagine how it would be
              hard to get replacement if you lose all your cards. And above it running out of money
              in the middle of a trip can really kill enjoyment.
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Keep at Different Places:</span> Get in the
              practice of looking back when you are about to leave somewhere. Trip to a place would
              be distracting, and you are possibly carrying more stuff, so it might be possible you
              may forget your jacket or any other valuable. So look back and ensure you're not
              leaving anything there.
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Don't Use Cards Everywhere:</span> Scan all
              you major travel documents and keep a copy in your email. Take a hard copy of your
              passport, travel insurance, visa etc and keep these all in a separate section of your
              luggage. Though it's a traditional practice you can consider the digital way also.
            </li>
          </ul>
        </div>

        <div className="w-full h-64 bg-gray-200 rounded-lg mb-10 flex items-center justify-center">
          <span className="text-gray-400">Image Placeholder</span>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Taking Care of the Valuables</h2>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            Valuable items like jewellery, mobile phones, cameras and other gadgets as well as
            expensive clothes are the things travellers usually carry on trips. To ensure their
            safety, you must:
          </p>

          <ul className="space-y-4 ml-6">
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Keep an Eye on Luggage in Public:</span>{' '}
              Leave your luggage, handbags or valuable unattended in public and they might just
              disappear in the thin air. Always keep the straps and handles hooked to your body
              parts and keep the handbags in your laps.
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Avoid Public Flaunting:</span> Show-off may
              result in loss. Avoid wearing jewellery items at crowded places. Keep your gadgets
              safe inside the locked luggage when you don't require them.
            </li>
            <li className="text-gray-700">
              <span className="font-bold text-gray-900">Check before Leaving:</span> Make it a habit
              to check that you are not leaving anything behind at hotel rooms, restaurants, tourist
              spots and other places you visit.
            </li>
          </ul>
        </div>

        <div className="w-full h-64 bg-gray-200 rounded-lg mb-10 flex items-center justify-center">
          <span className="text-gray-400">Image Placeholder</span>
        </div>
      </div>
    </div>
  );
}
