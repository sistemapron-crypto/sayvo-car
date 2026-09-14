import React from 'react';
import { Calendar, Gauge, Fuel, Cog, Palette, FileText, Eye, ShieldCheck, Zap } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { formatKm, formatPlate } from '../../utils/formatters';

interface VehicleSpecificationsProps {
  vehicle: Vehicle;
  className?: string;
}

export const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({
  vehicle,
  className = '',
}) => {
  const specs = [
    {
      icon: Calendar,
      label: 'Ano',
      value: vehicle.ano.toString(),
    },
    {
      icon: Gauge,
      label: 'Quilometragem',
      value: formatKm(vehicle.quilometragem),
    },
    {
      icon: Fuel,
      label: 'Combustível',
      value: vehicle.combustível,
    },
    {
      icon: Cog,
      label: 'Transmissão',
      value: vehicle.transmissão,
    },
    {
      icon: Palette,
      label: 'Cor',
      value: vehicle.cor,
    },
    {
      icon: FileText,
      label: 'Placa final',
      value: formatPlate(vehicle.placaFinal),
    },
    {
      icon: Eye,
      label: 'Visualizações',
      value: vehicle.visualizações.toString(),
    },
  ];

  if (vehicle.blindado) {
    specs.push({
      icon: ShieldCheck,
      label: 'Blindagem',
      value: 'Nível III-A',
    });
  }

  if (vehicle.potência) {
    specs.push({
      icon: Zap,
      label: 'Potência',
      value: vehicle.potência,
    });
  }

  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs ${className}`}
    >
      <div className="grid grid-cols-2 gap-y-6 gap-x-6">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs text-slate-400 font-medium">
                  {spec.label}
                </span>
                <span className="block text-sm sm:text-base font-bold text-slate-900 truncate">
                  {spec.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
