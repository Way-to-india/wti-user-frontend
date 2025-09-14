'use client';
import HeroPage from '@/app/general/Hero';
import Trending from '@/app/general/Trending';
import NavBar from '@/components/navbar/NavBar';
import { useTheme } from '@/context/ThemeContext';
import BlogSection from '../../components/BlogSection';
import Footer from '../../components/Footer';
import AirCharter from './AirCharterTour';
import Deals from './Deals';
import Inspiration from './Inspiration';
import Package from './Package';
// import TourCheckout from "@/app/trip-details/checkout/page";

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
      {/* Main contents */}
      <div className="relative z-10">
        <NavBar />
        <HeroPage />
        <Package />
        <Trending />
        <Inspiration />
        <AirCharter />
        <Deals />
        <BlogSection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
