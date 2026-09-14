import React from 'react';
import { Eye, Calendar, Gauge, Fuel, Cog, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { formatCurrency, formatKm } from '../../utils/formatters';

interface VehicleCardDesktopProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
}

export const VehicleCardDesktop: React.FC<VehicleCardDesktopProps> = ({
  vehicle,
  onSelect,
}) => {
  return (
    <article
      onClick={() => onSelect(vehicle)}
      className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={vehicle.imagens[0]}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-300"
        />

        {/* Views badge top right matching Reference 1 */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium shadow-xs">
          <Eye className="w-3.5 h-3.5" />
          <span>{vehicle.visualizações}</span>
        </div>

        {/* Blindado badge if applicable */}
        {vehicle.blindado && (
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Blindado</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-violet-700 transition-colors line-clamp-1 capitalize">
            {vehicle.modelo}
          </h3>

          {/* Version */}
          <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-0.5 mb-3.5">
            {vehicle.versão}
          </p>

          {/* Price Block matching Reference 1 */}
          <div className="mb-4">
            <div className="text-2xl font-extrabold text-[#059669] tracking-tight">
              {formatCurrency(vehicle.preço)}
            </div>
            <span className="text-xs text-slate-400 font-normal">À vista</span>
          </div>

          {/* Technical Specs 2x2 Grid matching Reference 1 */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {/* Ano */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{vehicle.ano}</span>
            </div>

            {/* Quilometragem */}
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatKm(vehicle.quilometragem)}</span>
            </div>

            {/* Combustível */}
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{vehicle.combustível}</span>
            </div>

            {/* Transmissão */}
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{vehicle.transmissão}</span>
            </div>
          </div>
        </div>

        {/* Ver Detalhes Button matching Reference 1 */}
        <div className="mt-5 pt-1">
          <button
            type="button"
            className="w-full py-2.5 bg-[#0F172A] group-hover:bg-[#1E293B] text-white text-sm font-semibold rounded-lg transition-colors text-center cursor-pointer shadow-2xs"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  );
};
