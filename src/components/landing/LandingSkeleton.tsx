'use client';
import NavBar from '@/components/navbar/NavBar';
import { useTheme } from '@/context/ThemeContext';

export default function LandingSkeleton() {
  const theme = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.milkWhite }}>
      {/* Navbar */}
      <NavBar />

      {/* Hero section skeleton */}
      <div
        className="w-full h-[600px] animate-pulse mb-12"
        style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
      />

      {/* Search section skeleton */}
      <div className="container mx-auto px-4 -mt-20 z-10 relative mb-16">
        <div
          className="h-[100px] rounded-lg animate-pulse"
          style={{ backgroundColor: theme.colors.milkWhite }}
        />
      </div>

      {/* Featured tours skeleton */}
      <div className="container mx-auto px-4 mb-20">
        <div className="flex justify-between items-center mb-8">
          <div
            className="h-8 w-48 rounded-lg animate-pulse"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
          <div
            className="h-6 w-32 rounded-lg animate-pulse"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-[320px] rounded-lg animate-pulse"
              style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
            />
          ))}
        </div>
      </div>

      {/* Popular destinations skeleton */}
      <div className="container mx-auto px-4 mb-20">
        <div className="flex justify-between items-center mb-8">
          <div
            className="h-8 w-48 rounded-lg animate-pulse"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
          <div
            className="h-6 w-32 rounded-lg animate-pulse"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-[300px] rounded-lg animate-pulse"
              style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
            />
          ))}
        </div>
      </div>

      {/* Services section skeleton */}
      <div className="bg-gray-50 py-16 mb-20">
        <div className="container mx-auto px-4">
          <div
            className="h-8 w-48 rounded-lg mx-auto animate-pulse mb-12"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="h-[150px] rounded-lg animate-pulse"
                style={{ backgroundColor: theme.colors.milkWhite }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials skeleton */}
      <div className="container mx-auto px-4 mb-20">
        <div
          className="h-8 w-60 rounded-lg mx-auto animate-pulse mb-12"
          style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {' '}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-[200px] rounded-lg animate-pulse"
              style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
            />
          ))}
        </div>
      </div>

      {/* CTA Section skeleton */}
      <div
        className="w-full h-[250px] animate-pulse mb-20"
        style={{ backgroundColor: theme.colors.carrotOrange }}
      />
    </div>
  );
}
