import React from 'react';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface CityFactsProps {
  cityData: CityDetails;
}

export function CityFacts({ cityData }: CityFactsProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-5 h-5 bg-orange-500 rounded-xl flex items-center justify-center">
          <Info className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-bold text-gray-900 text-2xl">Facts</h2>
      </div>

      <p className="text-gray-700 text-md leading-relaxed mb-8">{cityData.facts}</p>

      {cityData.historyCulture && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 text-2xl mb-4">History & Culture</h3>
          <p className="text-gray-700 lg:text-lg leading-relaxed">{cityData.historyCulture}</p>
        </div>
      )}
    </div>
  );
}
