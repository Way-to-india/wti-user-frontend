import Image from 'next/image';
import React from 'react';

interface TourImageGalleryProps {
  images: string[];
  title: string;
  onImageClick: (index: number) => void;
}

const TourImageGallery: React.FC<TourImageGalleryProps> = ({ images, title, onImageClick }) => {
  return (
    <>
      <div className="relative h-[250px] sm:h-[300px] lg:h-[400px] w-full rounded-lg overflow-hidden mb-3">
        <Image
          src={images?.[0] || '/placeholder-image.jpg'}
          alt={title}
          fill
          className="object-cover cursor-pointer"
          onClick={() => images?.length > 0 && onImageClick(0)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {images?.slice(1, 4).map((url: string, index: number) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onImageClick(index + 1)}
          >
            <Image src={url} alt={`${title} ${index + 2}`} fill className="object-cover" />
            {index === 2 && images.length > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  onImageClick(3);
                }}
              >
                <span className="text-white text-lg font-medium">+{images.length - 4} images</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TourImageGallery;
