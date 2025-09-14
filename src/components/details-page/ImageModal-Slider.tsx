// components/ImageModal.tsx
// View more Images Modal : Concept 1
import React, { useEffect, useRef, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Slider settings
const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show 3 thumbnails at a time
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '40px',
    focusOnSelect: true,
};

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

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        }
    };
    if (!isOpen || images.length === 0) return null;// Do not render if not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg p-4 max-w-4xl mx-auto overflow-hidden"
            >
                {/* Main Image with Prev/Next Buttons */}
                <div className="relative">
                    <button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
                        onClick={handlePrev}
                        disabled={currentIndex === 0} // Disable if it's the first image
                    >
                        &#10094;
                    </button>

                    <Image
                        src={images[currentIndex]}
                        alt={`Main image ${currentIndex}`}
                        layout="responsive"
                        width={500}
                        height={500}
                        className="object-cover rounded-md"
                    />

                    <button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
                        onClick={handleNext}
                        disabled={currentIndex === images.length - 1} // Disable if it's the last image
                    >
                        &#10095; {/* Right Chevron */}
                    </button>
                </div>

                {/* Thumbnail Slider Below */}
                <div className="mt-4">
                    <Slider {...settings} afterChange={setCurrentIndex}>
                        {images.map((img, index) => (
                            <div key={index} className="!flex !justify-center">
                                <button onClick={() => handleThumbnailClick(index)}>
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index}`}
                                        width={120}
                                        height={120}
                                        className={`object-cover rounded-md ${currentIndex === index ? 'border-4 border-blue-500' : ''}`} // Highlight selected thumbnail
                                    />
                                </button>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;

