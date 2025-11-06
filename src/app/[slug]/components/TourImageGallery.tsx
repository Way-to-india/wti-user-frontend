import Image from 'next/image';
import React from 'react';

interface TourImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

const TourImageGallery: React.FC<TourImageGalleryProps> = ({ images, title, onImageClick }) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] w-full rounded-lg overflow-hidden mb-3 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div role="region" aria-label="Tour image gallery">
      {/* Hero Image - Priority loaded for LCP */}
      <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] w-full rounded-lg overflow-hidden mb-3">
        <Image
          src={images[0]}
          alt={`${title} - Main view`}
          fill
          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => onImageClick(0)}
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
      </div>

      {/* Thumbnail Grid - Lazy loaded */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {images.slice(1, 4).map((url: string, index: number) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => onImageClick(index + 1)}
            >
              <Image
                src={url}
                alt={`${title} - View ${index + 2}`}
                fill
                className="object-cover"
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 50vw, 300px"
              />
              {index === 2 && images.length > 4 && (
                <button
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    onImageClick(3);
                  }}
                  aria-label={`View all ${images.length} images`}
                >
                  <span className="text-white text-lg font-medium">
                    +{images.length - 4} images
                  </span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TourImageGallery;