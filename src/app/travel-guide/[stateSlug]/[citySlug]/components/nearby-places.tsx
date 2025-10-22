import React from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface NearbyPlacesProps {
  cityData: CityDetails;
}

interface NearbyPlace {
  name: string;
  distance: string;
  description: string;
}

export function NearbyPlaces({ cityData }: NearbyPlacesProps) {
  const parseNearbyPlaces = (text: string): NearbyPlace[] => {
    if (!text) return [];

    const places: NearbyPlace[] = [];

    const placeRegex = /([^:]+?)\s*\(about\s+(\d+)\s*km\.\):\s*([^.]+(?:\.[^.]+)*\.)/gi;
    let match;

    while ((match = placeRegex.exec(text)) !== null) {
      places.push({
        name: match[1].trim(),
        distance: `about ${match[2]} km.`,
        description: match[3].trim(),
      });
    }

    if (places.length === 0) {
      const sentences = text.split(/(?<=\.)\s+(?=[A-Z])/);
      sentences.forEach(sentence => {
        const colonIndex = sentence.indexOf(':');
        if (colonIndex > 0) {
          const titlePart = sentence.substring(0, colonIndex).trim();
          const description = sentence.substring(colonIndex + 1).trim();

          const distanceMatch = titlePart.match(/\(about\s+(\d+)\s*km\.\)/i);
          const distance = distanceMatch ? `about ${distanceMatch[1]} km.` : '';
          const name = titlePart.replace(/\(about\s+\d+\s*km\.\)/i, '').trim();

          if (name && description) {
            places.push({ name, distance, description });
          }
        }
      });
    }

    return places;
  };

  const nearbyPlacesList = parseNearbyPlaces(cityData.nearbyPlaces || "");

  return (
    <div className="space-y-8">
      <div className="pt-8 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-bold text-gray-900 lg:text-3xl text-2xl">Nearby Places:</h2>
        </div>

        {nearbyPlacesList.length > 0 ? (
          <ul className="space-y-4">
            {nearbyPlacesList.map((place, index) => (
              <li key={index} className="flex gap-2">
                <span className="text-gray-800 text-xl mt-1">•</span>
                <div>
                  <span className="font-bold text-gray-900 text-lg">{place.name}</span>
                  {place.distance && (
                    <span className="font-bold text-gray-900 text-lg"> ({place.distance}):</span>
                  )}
                  <span className="text-gray-700 text-base ml-1">{place.description}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <p className="text-gray-700 lg:text-lg leading-relaxed">{cityData.nearbyPlaces}</p>
          </div>
        )}
      </div>

      {cityData.gettingAround && (
        <div className='mt-5'>
          <h3 className="font-bold text-gray-900 text-2xl mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            Getting Around
          </h3>
          <p className="text-gray-700 text-md leading-relaxed">{cityData.gettingAround}</p>
        </div>
      )}
    </div>
  );
}
