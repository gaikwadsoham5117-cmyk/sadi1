import React, { useState } from 'react';
import { getCloudinaryUrl } from '../services/cloudinary.js';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{ url: string; publicId?: string }>;
  productName: string;
  selectedColorImage?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName, selectedColorImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [colorOverride, setColorOverride] = useState<string | null>(null);

  // Sync with color swatch changes
  React.useEffect(() => {
    if (selectedColorImage) {
      setColorOverride(selectedColorImage);
      const matchIdx = images.findIndex((img) => img.url === selectedColorImage);
      if (matchIdx !== -1) {
        setActiveIndex(matchIdx);
      }
    }
  }, [selectedColorImage, images]);

  const activeImage = colorOverride || images[activeIndex]?.url || images[0]?.url || '';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const nextImage = () => {
    setColorOverride(null);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setColorOverride(null);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-[550px] pb-2 lg:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setColorOverride(null);
              }}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden shrink-0 border-2 transition-all ${
                activeIndex === idx
                  ? 'border-[#5A1022] shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getCloudinaryUrl(img.url, { width: 160, height: 200, crop: 'fill' })}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Box */}
      <div className="relative flex-1 bg-[#F8F1E5] rounded-sm overflow-hidden border border-[#2C1B16]/10">
        <div
          className="relative aspect-[3/4] w-full cursor-crosshair overflow-hidden"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={getCloudinaryUrl(activeImage, { width: 1000, height: 1333, quality: 'auto:best', crop: 'fill' })}
            alt={productName}
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                  }
                : undefined
            }
            referrerPolicy="no-referrer"
          />

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-2 py-1 rounded text-[11px] text-[#2C1B16] flex items-center gap-1 shadow-sm pointer-events-none">
            <ZoomIn size={12} className="text-[#5A1022]" /> Hover to zoom zari weave
          </div>
        </div>

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 text-[#2C1B16] hover:bg-[#5A1022] hover:text-[#FFFDF8] shadow-md transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/85 text-[#2C1B16] hover:bg-[#5A1022] hover:text-[#FFFDF8] shadow-md transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
