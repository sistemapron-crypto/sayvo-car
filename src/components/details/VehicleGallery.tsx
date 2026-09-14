import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  vehicleTitle: string;
}

export const VehicleGallery: React.FC<VehicleGalleryProps> = ({
  images,
  vehicleTitle,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeImages = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80'
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Showcase matching Reference 3 */}
      <div className="relative aspect-[16/10] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 group shadow-sm">
        <img
          src={safeImages[selectedIndex]}
          alt={`${vehicleTitle} - Foto ${selectedIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />

        {/* Carousel Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity opacity-80 hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Badge matching Reference 3 (e.g. 1 / 10) */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
          {selectedIndex + 1} / {safeImages.length}
        </div>
      </div>

      {/* Thumbnails Grid matching Reference 3 */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {safeImages.map((img, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 transition-all cursor-pointer focus:outline-hidden ${
                  isActive
                    ? 'ring-2 ring-[#5B21B6] ring-offset-2 scale-[1.02] shadow-xs'
                    : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
