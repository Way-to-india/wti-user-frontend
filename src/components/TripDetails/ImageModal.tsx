import React, { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  setCurrentIndex 
}) => {
  const handleNext = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, setCurrentIndex]);

  // Add keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center">
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-5 right-5 text-white hover:text-orange-400 transition-colors"
      >
        <FiX className="w-8 h-8" />
      </button>
      
      {/* Image container */}
      <div className="relative w-full h-[70vh] max-w-[90vw]">
        {images[currentIndex] && (
          <Image 
            src={images[currentIndex]} 
            alt={`Tour image ${currentIndex + 1}`} 
            fill 
            className="object-contain" 
          />
        )}
        
        {/* Navigation buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-opacity"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 transition-opacity"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Image counter */}
      <div className="text-white mt-4">
        {currentIndex + 1} / {images.length}
      </div>
      
      {/* Thumbnails row */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-[90vw]">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={`relative w-20 h-20 cursor-pointer transition-opacity ${currentIndex === idx ? 'border-2 border-orange-500' : 'opacity-70 hover:opacity-100'}`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageModal;
