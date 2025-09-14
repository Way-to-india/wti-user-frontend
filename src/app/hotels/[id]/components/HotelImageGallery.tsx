import React from 'react';
import Image from 'next/image';
import placeholderImage from '@/assets/images/destination.png';

interface HotelImageGalleryProps {
  images: string[];
  hotelName: string;
  onImageClick: (index: number) => void;
}

export const HotelImageGallery: React.FC<HotelImageGalleryProps> = ({
  images,
  hotelName,
  onImageClick,
}) => {
  const hotelImages = images && images.length > 0 ? images : Array(4).fill(placeholderImage.src);

  return (
    <div className="space-y-3">
      {/* Main large image */}
      <div
        className="relative w-full h-[350px] rounded-lg overflow-hidden cursor-pointer"
        onClick={() => onImageClick(0)}
      >
        <Image src={hotelImages[0]} alt={hotelName} fill className="object-cover" />
      </div>

      {/* Three smaller images row */}
      <div className="grid grid-cols-3 gap-3">
        {hotelImages.slice(1, 4).map((image, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
            onClick={() => onImageClick(index + 1)}
          >
            <Image src={image} alt={`${hotelName} ${index + 2}`} fill className="object-cover" />
            {index === 2 && hotelImages.length > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  onImageClick(index + 1);
                }}
              >
                <span className="text-white font-medium text-lg">
                  +{hotelImages.length - 4} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
