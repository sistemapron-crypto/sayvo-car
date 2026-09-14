import React from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const iconClasses = size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
      className={`rounded-full flex items-center justify-center transition-all cursor-pointer ${
        isFavorite
          ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs'
          : 'bg-white/90 hover:bg-white text-slate-400 hover:text-slate-600 border border-slate-200/80 shadow-2xs'
      } ${sizeClasses} ${className}`}
    >
      <Heart
        className={`${iconClasses} transition-transform active:scale-125 ${
          isFavorite ? 'fill-rose-600 stroke-rose-600' : 'stroke-[1.8px]'
        }`}
      />
    </button>
  );
};
