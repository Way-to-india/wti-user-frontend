'use client';
import { useTheme } from "@/context/ThemeContext";

export default function HotelsSkeleton() {
  const theme = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        {/* Search section skeleton */}
        <div 
          className="w-full h-24 rounded-lg animate-pulse"
          style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
        />
        
        <div className="flex gap-6">
          {/* Filters skeleton */}
          <div 
            className="w-64 h-[600px] rounded-lg animate-pulse"
            style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
          />
          
          {/* Hotel cards skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div 
                  key={index} 
                  className="h-[400px] rounded-lg animate-pulse"
                  style={{ backgroundColor: theme.colors.carrotOrange + '20' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 