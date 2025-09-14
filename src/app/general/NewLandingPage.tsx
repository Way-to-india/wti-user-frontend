'use client';

import HeroPage from '@/app/general/Hero';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import NavBar from '@/components/navbar/NavBar';
import { useTheme } from '@/context/ThemeContext';
import AirCharter from './AirCharterTour';
import Deals from './Deals';
import FeaturedTours from './FeaturedTours';
import Inspiration from './Inspiration';
import Package from './Package';
import Trending from './Trending';

const NewLandingPage = () => {
  const theme = useTheme();

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: theme.colors.milkWhite,
        color: theme.colors.heavyMetal,
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: theme.typography.fontSize.body,
      }}
    >
      {/* Main contents with proper spacing for all devices */}
      <div className="relative z-10">
        {/* NavBar is already sticky from its component definition */}
        <NavBar />

        {/* Hero Section with Search */}
        <HeroPage />

        {/* Featured Tours Section - Added just below hero section */}
        <section className="py-8 md:py-12 px-4 md:px-10" id="featured-tours">
          <FeaturedTours />
        </section>

        {/* Featured Packages Section */}
        <section className="py-8 md:py-12 px-4 md:px-10" id="featured-packages">
          <Package />
        </section>

        {/* Trending Hotels and Stays */}
        <section className="py-8 md:py-12 px-4 md:px-10 bg-gray-50" id="trending-hotels">
          <Trending />
        </section>

        {/* Travel Inspiration Section */}
        <section className="py-8 md:py-12 px-4 md:px-10" id="travel-inspiration">
          <Inspiration />
        </section>

        {/* Air Charter Tours Section */}
        <section className="py-8 md:py-12 px-4 md:px-10 bg-gray-50" id="air-charter">
          <AirCharter />
        </section>

        {/* Deals Section */}
        <section className="py-6 md:py-8 px-4 md:px-10" id="deals">
          <Deals />
        </section>

        {/* Blog Section */}
        <section className="py-8 md:py-12 px-4 md:px-10" id="blog">
          <BlogSection />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default NewLandingPage;
