'use client';
import { useTheme } from '@/context/ThemeContext';

export default function ToursSkeleton() {
  const theme = useTheme();

  return (
    <div className="container mx-auto px-4 py-8">
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse-dark {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }

        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.15) 20%,
            rgba(0, 0, 0, 0.15) 40%,
            rgba(0, 0, 0, 0.05) 100%
          );
          background-size: 1000px 100%;
        }

        .pulse-dark {
          animation: pulse-dark 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="flex flex-col gap-6">
        {/* Search section skeleton with shimmer effect */}
        <div
          className="w-full h-32 rounded-xl shimmer pulse-dark"
          style={{
            backgroundColor: '#e5e7eb',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner elements simulation */}
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex gap-4 flex-1">
              <div
                className="w-48 h-12 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
              />
              <div
                className="w-48 h-12 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
              />
              <div
                className="w-48 h-12 rounded-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
              />
            </div>
            <div
              className="w-32 h-12 rounded-lg"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar skeleton */}
          <div
            className="w-72 rounded-xl shimmer pulse-dark"
            style={{
              backgroundColor: '#e5e7eb',
              minHeight: '600px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Filter sections simulation */}
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="space-y-3">
                  <div
                    className="w-32 h-5 rounded"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
                  />
                  <div className="space-y-2">
                    <div
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    />
                    <div
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    />
                    <div
                      className="w-3/4 h-8 rounded"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tour cards skeleton grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl shimmer pulse-dark overflow-hidden"
                  style={{
                    backgroundColor: '#e5e7eb',
                    height: '420px',
                    position: 'relative',
                  }}
                >
                  {/* Card structure simulation */}
                  <div className="h-full flex flex-col">
                    {/* Image area */}
                    <div className="h-56" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

                    {/* Content area */}
                    <div className="flex-1 p-4 space-y-3">
                      <div
                        className="w-3/4 h-6 rounded"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                      />
                      <div className="space-y-2">
                        <div
                          className="w-full h-4 rounded"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                        />
                        <div
                          className="w-5/6 h-4 rounded"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <div
                          className="w-24 h-6 rounded"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        />
                        <div
                          className="w-16 h-6 rounded"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
