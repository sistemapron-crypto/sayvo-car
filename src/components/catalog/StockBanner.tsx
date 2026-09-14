import React from 'react';

export interface StockBannerProps {
  className?: string;
}

export const StockBanner: React.FC<StockBannerProps> = ({ className = '' }) => {
  return (
    <div
      aria-label="Destaque Ronimotors"
      className={`relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px] overflow-hidden bg-slate-950 border-b border-slate-200/80 ${className}`}
    >
      {/* Background Automotive Image */}
      <img
        src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85"
        alt="Veículo esportivo seminovo de luxo"
        className="absolute inset-0 w-full h-full object-cover object-[65%_center] sm:object-[center_42%] pointer-events-none select-none"
        loading="eager"
      />

      {/* Subtle Gradient Overlays: keeps car visible while giving crisp contrast to text */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent sm:hidden" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-md sm:max-w-xl lg:max-w-2xl">
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-violet-300 drop-shadow-xs mb-2">
            Ronimotors Automóveis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
            Seu próximo carro está aqui.
          </h2>
          <p className="text-xs sm:text-base md:text-lg text-slate-200/90 font-medium mt-2 sm:mt-2.5 drop-shadow-xs line-clamp-1 sm:line-clamp-none">
            Encontre veículos selecionados para você.
          </p>
        </div>
      </div>
    </div>
  );
};
