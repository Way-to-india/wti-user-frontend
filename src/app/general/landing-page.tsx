'use client';
import HeroPage from '@/app/general/Hero';
import Trending from '@/app/general/Trending';
import { useTheme } from '@/context/ThemeContext';
import BlogSection from '../../components/BlogSection';
import AirCharter from './AirCharterTour';
import Deals from './Deals';
import Inspiration from './Inspiration';
import Package from './Package';
import NavBar from '@/components/layout/navbar/NavBar';
import Footer from '@/components/layout/Footer';

const LandingPage = () => {
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
        <Package />
        {/* <Trending /> */}
        <Inspiration />
        {/* <AirCharter /> */}
        {/* <Deals /> */}
        {/* <BlogSection /> */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
