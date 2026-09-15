import React, { useEffect, useState } from 'react';
import { getStoreConfig } from '../../services/storeService';

export interface StockBannerProps {
  className?: string;
}

export const StockBanner: React.FC<StockBannerProps> = ({ className = '' }) => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [bannerTitulo, setBannerTitulo] = useState(
    'Seu próximo carro está aqui.'
  );
  const [bannerSubtitulo, setBannerSubtitulo] = useState(
    'Encontre veículos selecionados para você.'
  );
  const [bannerPosicao, setBannerPosicao] = useState('esquerda');

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        if (config.bannerUrl) {
          setBannerUrl(config.bannerUrl);
        }

        setBannerTitulo(
          config.bannerTitulo || 'Seu próximo carro está aqui.'
        );

        setBannerSubtitulo(
          config.bannerSubtitulo || 'Encontre veículos selecionados para você.'
        );

        setBannerPosicao(config.bannerPosicao || 'esquerda');
      })
      .catch((error) => {
        console.error('Erro ao carregar o banner da loja:', error);
      });
  }, []);

  const alinhamento =
    bannerPosicao === 'direita'
      ? 'items-end text-right'
      : 'items-start text-left';

  return (
    <div
      aria-label="Destaque"
      className={`relative w-full h-[calc(100vh-80px)] min-h-[520px] sm:h-[520px] md:h-[560px] lg:h-[600px] overflow-hidden bg-slate-950 border-b border-slate-200/80 ${className}`}
    >
      {/* Background Automotive Image */}
      <img
        src={
          bannerUrl ||
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=85'
        }
        alt="Veículo esportivo seminovo de luxo"
        className="absolute inset-0 w-full h-full object-cover object-[60%_center] sm:object-[center_45%] pointer-events-none select-none"
        loading="eager"
      />

      {/* Subtle Gradient Overlays: keeps car visible while giving crisp contrast to text */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent sm:hidden" />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end sm:justify-center pb-10 sm:pb-0">
        <div
          className={`max-w-[90%] sm:max-w-xl lg:max-w-2xl flex flex-col ${alinhamento}`}
        >
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
            {bannerTitulo}
          </h2>

          <p className="text-xs sm:text-base md:text-lg text-slate-200/90 font-medium mt-2 sm:mt-2.5 drop-shadow-xs">
            {bannerSubtitulo}
          </p>
        </div>
      </div>
    </div>
  );
};