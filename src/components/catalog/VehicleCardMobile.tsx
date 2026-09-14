import React from 'react';
import { Calendar, Gauge } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { formatCurrency, formatKm } from '../../utils/formatters';
import { FavoriteButton } from '../common/FavoriteButton';

interface VehicleCardMobileProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onSelect: (vehicle: Vehicle) => void;
}

export const VehicleCardMobile: React.FC<VehicleCardMobileProps> = ({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <article
      onClick={() => onSelect(vehicle)}
      className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer flex flex-col gap-3"
    >
      {/* Horizontal Top Row: Image on Left, Info on Right matching Reference 2 */}
      <div className="flex gap-3 items-start">
        {/* Compact Thumbnail Image */}
        <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-lg overflow-hidden bg-slate-100 shrink-0">
          <img
            src={vehicle.imagens[0]}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Info Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0 pr-1">
              {/* Modelo Title */}
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight truncate">
                {vehicle.modelo}
              </h3>
              {/* Versão */}
              <p className="text-[11px] text-slate-400 font-medium uppercase truncate">
                {vehicle.versão}
              </p>
            </div>

            {/* Favorite Heart Button matching Reference 2 */}
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton
                size="sm"
                isFavorite={isFavorite}
                onToggle={onToggleFavorite}
              />
            </div>
          </div>

          {/* Specs inline matching Reference 2: 2023 • 41.173 Km */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium my-1.5 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {vehicle.ano}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              {formatKm(vehicle.quilometragem)}
            </span>
          </div>

          {/* Price */}
          <div className="text-base font-extrabold text-slate-900 sm:text-[#059669]">
            {formatCurrency(vehicle.preço)}
          </div>
        </div>
      </div>

      {/* Ver Mais Detalhes Button full width matching Reference 2 */}
      <button
        type="button"
        className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 active:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer shadow-2xs"
      >
        Ver Mais Detalhes
      </button>
    </article>
  );
};
