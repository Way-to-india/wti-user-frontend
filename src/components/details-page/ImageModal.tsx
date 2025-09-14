// components/ImageModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import image1 from "@/assets/images/imageGallery/249-200x300.jpg"
import image2 from "@/assets/images/imageGallery/259-200x300.jpg"
import image3 from "@/assets/images/imageGallery/49-400x300.jpg"
import image4 from "@/assets/images/imageGallery/599-400x300.jpg"
import image5 from "@/assets/images/imageGallery/645-400x300.jpg"
import image6 from "@/assets/images/imageGallery/869-200x300.jpg"

const imagesPlaceholder = [image1, image2, image3, image4, image5, image6, image1, image2, image3, image4, image5, image6];

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: StaticImageData[];
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, images }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Close the modal if clicked outside
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

    if (!isOpen || images.length === 0) return null; // Do not render if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-4 max-w-4xl mx-auto overflow-hidden"
            >
                {/* Main Image */}
                {/* Thumbnail Image List Below */}
                <ImageList sx={{ width: 700, height: 450 }} variant="masonry" cols={4} gap={8}>
                    {imagesPlaceholder.map((img, index) => (
                        <ImageListItem key={index}>
                            <img
                                srcSet={`${img.src}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${img.src}?w=248&fit=crop&auto=format`}
                                alt={`Thumbnail ${index}`}
                                loading="lazy"
                                onClick={() => handleThumbnailClick(index)}
                                className={`cursor-pointer rounded-md ${currentIndex === index ? 'border-4 border-blue-500' : ''}`} // Highlight selected thumbnail
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
        </div>
    );
};

export default ImageModal;
