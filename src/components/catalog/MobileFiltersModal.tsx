import React from 'react';
import { X, Check } from 'lucide-react';
import { VehicleFilters } from '../../types/vehicle';
import { formatCurrency } from '../../utils/formatters';

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VehicleFilters;
  onChange: (newFilters: VehicleFilters) => void;
  availableBrands: { name: string; count: number }[];
  onReset: () => void;
  totalFilteredCount: number;
}

const YEAR_OPTIONS = [2014, 2016, 2018, 2020, 2021, 2022, 2023, 2024, 2025];
const FUEL_OPTIONS = ['Todos', 'Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Álcool'];
const TRANSMISSION_OPTIONS = ['Todas', 'Automático', 'Manual', 'CVT'];

export const MobileFiltersModal: React.FC<MobileFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  availableBrands,
  onReset,
  totalFilteredCount,
}) => {
  if (!isOpen) return null;

  const currentMaxPrice = filters.maxPrice ?? 1000000;

  const toggleBrand = (brandName: string) => {
    const exists = filters.marcas.includes(brandName);
    const updated = exists
      ? filters.marcas.filter((b) => b !== brandName)
      : [...filters.marcas, brandName];
    onChange({
      ...filters,
      marcas: updated,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-900">Filtros</h3>
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-slate-700 underline font-medium"
            >
              Limpar tudo
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Veículos Blindados Toggle */}
          <div className="flex items-center justify-between py-1 border-b border-slate-100 pb-4">
            <div>
              <span className="text-sm font-semibold text-slate-900">Apenas Blindados</span>
              <p className="text-xs text-slate-400">Mostrar somente carros com blindagem</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={filters.blindadoOnly}
              onClick={() =>
                onChange({
                  ...filters,
                  blindadoOnly: !filters.blindadoOnly,
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                filters.blindadoOnly ? 'bg-violet-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  filters.blindadoOnly ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Faixa de Preço */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Faixa de Preço
              </label>
              <span className="text-xs text-violet-700 font-bold">
                Até {formatCurrency(currentMaxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={currentMaxPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: Number(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
            />
          </div>

          {/* Marcas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Marcas
            </label>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(({ name, count }) => {
                const isSelected = filters.marcas.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleBrand(name)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-violet-50 border-violet-600 text-violet-800 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {name}
                    <span className="text-[10px] opacity-70">({count})</span>
                    {isSelected && <Check className="w-3 h-3 text-violet-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ano */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ano de Fabricação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.minAno || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minAno: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
              >
                <option value="">De (Ano)</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={`m-min-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                value={filters.maxAno || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxAno: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
              >
                <option value="">Até (Ano)</option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={`m-max-${y}`} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Combustível */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Combustível
            </label>
            <select
              value={filters.combustível || 'Todos'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  combustível: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            >
              {FUEL_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Transmissão */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Transmissão
            </label>
            <select
              value={filters.transmissão || 'Todas'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  transmissão: e.target.value,
                })
              }
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700"
            >
              {TRANSMISSION_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Apply Button */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center shadow-xs cursor-pointer"
          >
            Ver {totalFilteredCount} {totalFilteredCount === 1 ? 'veículo' : 'veículos'}
          </button>
        </div>
      </div>
    </div>
  );
};
