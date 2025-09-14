// components/DetailsPage.tsx
import Image, { StaticImageData } from 'next/image';
import React, { useState } from 'react';

import Image404 from '@/assets/images/image404.png';

interface imageGalleryProp {
  placeHolderImage: { img: StaticImageData }[];
}

const ImageGallery: React.FC<imageGalleryProp> = ({ placeHolderImage }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<StaticImageData>(
    placeHolderImage.length > 0 ? placeHolderImage[0].img : Image404
  );

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleThumbnailClick = (img: StaticImageData) => {
    setSelectedImage(img);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Image
          src={selectedImage}
          alt="Selected Image"
          width={600}
          height={400}
          className="w-full object-cover rounded-md"
        />
      </div>

      <div className="flex gap-2 overflow-x-scroll w-full h-[22]">
        {/* Thumbnails */}
        {placeHolderImage.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 max-w-[150px] cursor-pointer"
            onClick={() => handleThumbnailClick(item.img)}
          >
            <Image
              src={item.img}
              alt={`Thumbnail ${index}`}
              layout="responsive"
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      {/* <ImageModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            images={placeHolderImage.map(item => item.img)} // Pass all images to the modal
        /> */}
    </div>
  );
};

export default ImageGallery;
