
import { Metadata } from 'next';
import { travelGuideAPI } from '@/lib/api/travel-guide.api';
import CityDetailsClient from './city-details-client';


export async function generateMetadata({
  params,
}: {
  params: { stateSlug: string; citySlug: string };
}): Promise<Metadata> {
  try {
    const cityData = await travelGuideAPI.getCityDetailsBySlug(
      params.citySlug,
      params.stateSlug
    );
    const title = `${cityData.city} Travel Guide | Best Time, Places to Visit, How to Reach`;
    const description = `Explore ${cityData.city}, ${cityData.state} — complete travel guide with history, attractions, and travel tips.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: cityData.cityImage ? [{ url: cityData.cityImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: cityData.cityImage ? [cityData.cityImage] : [],
      },

      keywords: [
        cityData.city,
        cityData.state,
        'travel guide',
        'tourism',
        'places to visit',
        'how to reach',
        'best time to visit',
        'India travel',
      ].join(', '),
      alternates: {
        canonical: `/travel-guide/${params.stateSlug}/${params.citySlug}`,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      title: 'Travel Guide | Discover India',
      description: 'Explore destinations across India with our comprehensive travel guides.',
    };
  }
}

export const dynamicParams = true;

export const revalidate = 3600;


export async function generateStaticParams() {
  try {
    const states = await travelGuideAPI.getAllStatesWithCities();
    console.log(states);
    const paths = states.flatMap(state =>
      state.cities.map(city => ({
        stateSlug: state.name.toLowerCase().replace(/\s+/g, '-'),
        citySlug: city.citySlug,
      }))
    );

    return paths;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}


export default async function CityDetailsPage({
  params,
}: {
  params: { stateSlug: string; citySlug: string };
}) {
  return <CityDetailsClient params={params} />;
}