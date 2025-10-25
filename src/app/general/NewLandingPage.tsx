'use client';

import HeroPage from '@/app/general/Hero';
import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/navbar/NavBar';
import { useTheme } from '@/context/ThemeContext';
import FeaturedTours from './FeaturedTours';
import Inspiration from './Inspiration';

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

        <LandingSection>
          <FeaturedTours />
        </LandingSection>

        <LandingSection>
          <Inspiration />
        </LandingSection>

        <Footer />
      </div>
    </div>
  );
};

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
