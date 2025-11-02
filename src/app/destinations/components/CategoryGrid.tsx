import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Landmark,
  Church,
  Castle,
  Building,
  Umbrella,
  TreePine,
  PawPrint,
  Mountain,
  Waves,
  MapPin,
} from 'lucide-react';
import { Category } from '@/lib/api/places-of-interest.api';

interface CategoryGridProps {
  categories: Category[];
}

const categoryIcons: Record<string, JSX.Element> = {
  temple: <Church className="w-10 h-10 text-orange-500" />,
  'religious-site': <Church className="w-10 h-10 text-orange-500" />,
  fort: <Castle className="w-10 h-10 text-orange-500" />,
  museum: <Building className="w-10 h-10 text-orange-500" />,
  beach: <Umbrella className="w-10 h-10 text-orange-500" />,
  park: <TreePine className="w-10 h-10 text-orange-500" />,
  parkgarden: <TreePine className="w-10 h-10 text-orange-500" />,
  wildlife: <PawPrint className="w-10 h-10 text-orange-500" />,
  'historical-monument': <Landmark className="w-10 h-10 text-orange-500" />,
  'heritage-site': <Landmark className="w-10 h-10 text-orange-500" />,
  monumentsite: <Landmark className="w-10 h-10 text-orange-500" />,
  hillmountain: <Mountain className="w-10 h-10 text-orange-500" />,
  'water-body': <Waves className="w-10 h-10 text-orange-500" />,
  unknown: <MapPin className="w-10 h-10 text-orange-500" />,
};

const categoryColors: Record<string, string> = {
  temple: 'from-orange-400 to-orange-500',
  'religious-site': 'from-orange-400 to-orange-500',
  fort: 'from-red-400 to-red-500',
  museum: 'from-purple-400 to-purple-500',
  beach: 'from-blue-400 to-blue-500',
  park: 'from-green-400 to-green-500',
  parkgarden: 'from-green-400 to-green-500',
  wildlife: 'from-yellow-400 to-yellow-500',
  'historical-monument': 'from-indigo-400 to-indigo-500',
  'heritage-site': 'from-pink-400 to-pink-500',
  monumentsite: 'from-gray-400 to-gray-500',
  hillmountain: 'from-teal-400 to-teal-500',
  'water-body': 'from-cyan-400 to-cyan-500',
  unknown: 'from-gray-300 to-gray-400',
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  const router = useRouter();

  const getCategoryIcon = (slug: string) => categoryIcons[slug] || categoryIcons.unknown;
  const getCategoryColor = (slug: string) => categoryColors[slug] || categoryColors.unknown;

  const handleCategoryClick = (slug: string) => {
    router.push(`/destinations/category/${slug}`);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Category</h2>
        <p className="text-gray-600">Discover places based on your interests</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl border border-gray-200"
          >
            <div className="flex justify-center mb-3 transform group-hover:scale-110 transition-transform">
              {getCategoryIcon(category.slug)}
            </div>
            <p className="text-sm font-bold text-gray-800 group-hover:text-orange-600 transition-colors mb-1 capitalize">
              {category.name.replace(/-/g, ' ')}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              {category.monumentCount} places
            </p>

            <div
              className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                category.slug,
              )} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
