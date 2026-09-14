import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PriceCardProps {
  price: number;
  className?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({ price, className = '' }) => {
  return (
    <div
      className={`bg-[#0B132B] text-white rounded-2xl p-6 text-center shadow-md ${className}`}
    >
      <div className="text-3xl sm:text-4xl font-black tracking-tight text-white">
        {formatCurrency(price)}
      </div>
      <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
        Preço à vista
      </p>
    </div>
  );
};
