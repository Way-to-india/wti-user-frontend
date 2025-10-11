'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import image1 from '@/assets/images/imageGallery/249-200x300.jpg';
import image2 from '@/assets/images/imageGallery/259-200x300.jpg';
import image3 from '@/assets/images/imageGallery/49-400x300.jpg';
import image4 from '@/assets/images/imageGallery/599-400x300.jpg';
import image5 from '@/assets/images/imageGallery/645-400x300.jpg';
import image6 from '@/assets/images/imageGallery/869-200x300.jpg';

const imagesPlaceholder = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
];

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: StaticImageData[];
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div ref={modalRef} className="bg-white rounded-lg p-4 max-w-4xl mx-auto overflow-hidden">
        {/* Main Image */}
        <div className="flex justify-center mb-4">
          <Image
            src={imagesPlaceholder[currentIndex]}
            alt={`Main image ${currentIndex}`}
            width={600}
            height={400}
            className="rounded-lg object-cover"
            loading="lazy"
            placeholder="blur"
          />
        </div>

        {/* Thumbnail List */}
        <ImageList sx={{ width: 700, height: 450 }} variant="masonry" cols={4} gap={8}>
          {imagesPlaceholder.map((img, index) => (
            <ImageListItem key={index} onClick={() => handleThumbnailClick(index)}>
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                width={200}
                height={200}
                className={`cursor-pointer rounded-md transition-all duration-200 hover:opacity-80 ${
                  currentIndex === index ? 'ring-4 ring-blue-500' : ''
                }`}
                loading="lazy"
                placeholder="blur"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default ImageModal;
