import React from 'react';
import Image from 'next/image';
import { UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface FoodAndShoppingProps {
  cityData: CityDetails;
}

export function FoodAndShopping({ cityData }: FoodAndShoppingProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Food & Dining Section */}
      {cityData.foodAndDining && (
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
              alt="Local cuisine"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-white font-bold text-2xl">What & Where to Eat</h3>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-700 lg:text-base leading-relaxed">{cityData.foodAndDining}</p>
          </div>
        </div>
      )}

      {/* Shopping Section */}
      {cityData.shopping && (
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-lg overflow-hidden border border-purple-100">
          <div className="relative h-64 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
              alt="Shopping"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-white font-bold text-2xl">What & Where to Shop</h3>
            </div>
          </div>

          <div className="p-8">
            <p className="text-gray-700 lg:text-base leading-relaxed">{cityData.shopping}</p>
          </div>
        </div>
      )}
    </div>
  );
}
