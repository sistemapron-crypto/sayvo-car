import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { VehicleCardDesktop } from './VehicleCardDesktop';
import { VehicleCardMobile } from './VehicleCardMobile';
import { Car, RefreshCw } from 'lucide-react';

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onResetFilters?: () => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles,
  isLoading = false,
  favorites,
  onToggleFavorite,
  onSelectVehicle,
  onResetFilters,
}) => {
  // Skeleton loading state
  if (isLoading) {
    return (
      <div>
        {/* Desktop Skeletons */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs animate-pulse p-4 space-y-4"
            >
              <div className="w-full aspect-[16/10] bg-slate-200 rounded-lg" />
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
              <div className="h-7 bg-slate-200 rounded w-1/2" />
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded" />
              </div>
              <div className="h-10 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Mobile Skeletons */}
        <div className="md:hidden space-y-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs animate-pulse space-y-3"
            >
              <div className="flex gap-3">
                <div className="w-28 h-24 bg-slate-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-5 bg-slate-200 rounded w-2/5" />
                </div>
              </div>
              <div className="h-9 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state when no vehicles match filters
  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center my-6">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Car className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum veículo encontrado</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Não encontramos veículos com os critérios e filtros selecionados. Tente ajustar a busca ou
          limpar os filtros.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Limpar todos os filtros</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Desktop 3-Column Grid matching Reference 1 */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <VehicleCardDesktop
            key={vehicle.id}
            vehicle={vehicle}
            onSelect={onSelectVehicle}
          />
        ))}
      </div>

      {/* Mobile Horizontal List matching Reference 2 */}
      <div className="md:hidden space-y-3.5">
        {vehicles.map((vehicle) => (
          <VehicleCardMobile
            key={vehicle.id}
            vehicle={vehicle}
            isFavorite={favorites.includes(vehicle.id)}
            onToggleFavorite={(e) => onToggleFavorite(vehicle.id, e)}
            onSelect={onSelectVehicle}
          />
        ))}
      </div>
    </div>
  );
};
