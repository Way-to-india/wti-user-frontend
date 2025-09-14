// components/DetailsPage.tsx
'use client';
import Overview from '@/app/trip-details/components/Overview';
import TabSection from '@/app/trip-details/components/Tab';
import BreadcrumbNav from '@/components/details-page/Breadcrumb-Nav';
import ImageGallery from '@/components/details-page/ImageGallery';
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import NavBar from '../../components/navbar/NavBar';
import { breadcrumbs } from './content.dto';

import { StaticImageData } from 'next/image';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { convertNumbersToMonths, fetcher, FilteredToursResponse } from './components/helpers';
import { IncluExclu } from './components/InclusionsExclusions';

const DetailsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<HTMLElement>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const searchParams = useSearchParams();

  const id = searchParams.get('tour_id');

  const url = process.env.api_base_url + `user/tour-packages/filter?tour_id=${id}`;
  // console.log(url);

  const { data, error, isLoading } = useSWR<FilteredToursResponse>(id ? url : null, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let tour = data?.data.tour as any;
  tour = tour[0];

  let startCity = data?.data.start_city as any;
  startCity = startCity[0];

  let itinerary = data?.data.itinerary as any;
  itinerary = itinerary[0];

  //    console.log(itinerary);

  const currentTitle = tour.tour_title;

  const numCities = tour.city_ids.length;

  const overviewData = {
    destination: tour.tour_title,
    category: tour.themes,
    rating: tour.rating,
    details: [
      {
        icon: 'Clock',
        title: 'Duration',
        value: `${tour.duration_count} Days, ${tour.duration_count - 1} Nights`,
      },
      { icon: 'MapPin', title: 'Starting From', value: startCity.city_name }, // Get start place for endpoint
      {
        icon: 'Heart',
        title: 'Best Time',
        value: convertNumbersToMonths(tour.best_recommended_months),
      }, // Set months in the database and get the months
      { icon: 'HandPeace', title: 'Ideal For', value: tour.ideal_for },
      { icon: 'Clock', title: 'Cities Covering', value: numCities },
    ],
    description: tour.description,
  };

  const ie: IncluExclu = {
    inclusions: tour.inclusions,
    exclusions: tour.exclusions,
  };

  const placeholderImages: { img: StaticImageData }[] = [];

  for (let i = 0; i < tour.image_urls.length; ++i) {
    placeholderImages[i] = { img: tour.image_urls[i] };
  }

  return (
    <section className="relative min-h-screen w-full">
      <NavBar />
      <div className="mx-auto py-4 px-[5%] mt-4">
        {/* Breadcrumb Navigation */}
        <BreadcrumbNav breadcrumbs={breadcrumbs} currentTitle={currentTitle} />
        {/* Main Content Section */}
        <div className="flex lg:flex-row flex-col gap-4 mt-8">
          {/* Image Gallery */}
          <div className="lg:w-1/2 w-full">
            <ImageGallery placeHolderImage={placeholderImages} />
          </div>
          {/* < ImageGallery /> */}
          {/* Overview Section */}
          <div className="lg:w-1/2 w-full">
            <Overview placeHolder={overviewData} />
          </div>
          {/* <Overview /> */}
        </div>
        {/* Tabs Section */}
        <TabSection ie={ie} itinerary={itinerary} />
      </div>
      <Footer bannerDisplayed="enquire" />
    </section>
  );
};

export default DetailsPage;
