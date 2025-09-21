'use client';

import HeroPage from '@/app/general/Hero';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/navbar/NavBar';
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
      <div className="relative z-10">
        <NavBar />

        <HeroPage />

        <LandingSection id="featured-tours">
          <FeaturedTours />
        </LandingSection>

        <LandingSection id="featured-packages">
          <Package />
        </LandingSection>

        <LandingSection id="trending-hotels" className="bg-gray-50">
          <Trending />
        </LandingSection>

        <LandingSection id="travel-inspiration">
          <Inspiration />
        </LandingSection>

        <LandingSection id="air-charter" className="bg-gray-50">
          <AirCharter />
        </LandingSection>

        <LandingSection id="deals" padding="sm">
          <Deals />
        </LandingSection>

        <LandingSection id="blog">
          <BlogSection />
        </LandingSection>

        <Footer />
      </div>
    </div>
  );
};

// Reusable section component for landing page sections
interface LandingSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

const LandingSection: React.FC<LandingSectionProps> = ({
  children,
  id,
  className = '',
  padding = 'md',
}) => {
  const getPaddingClasses = () => {
    const paddingMap = {
      sm: 'py-6 md:py-8 px-4 sm:px-6 lg:px-8',
      md: 'py-8 md:py-12 px-4 sm:px-6 lg:px-8',
      lg: 'py-12 md:py-16 px-4 sm:px-6 lg:px-8',
    };
    return paddingMap[padding];
  };

  return (
    <section id={id} className={`${getPaddingClasses()} ${className}`}>
      {children}
    </section>
  );
};

export default NewLandingPage;
