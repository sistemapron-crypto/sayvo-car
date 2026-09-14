import React from 'react';
import { VehicleFilters } from '../../types/vehicle';
import { formatCurrency } from '../../utils/formatters';

interface FilterSidebarProps {
  filters: VehicleFilters;
  onChange: (newFilters: VehicleFilters) => void;
  availableBrands: { name: string; count: number }[];
  onReset: () => void;
  className?: string;
}

const YEAR_OPTIONS = [2014, 2016, 2018, 2020, 2021, 2022, 2023, 2024, 2025];
const FUEL_OPTIONS = ['Todos', 'Flex', 'Gasolina', 'Diesel', 'Híbrido', 'Álcool'];
const TRANSMISSION_OPTIONS = ['Todas', 'Automático', 'Manual', 'CVT'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  availableBrands,
  onReset,
  className = '',
}) => {
  const currentMaxPrice = filters.maxPrice ?? 1000000;
  const currentMinPrice = filters.minPrice ?? 0;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    onChange({
      ...filters,
      maxPrice: val,
    });
  };

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
    <aside className={`bg-white rounded-xl border border-slate-200/80 p-5 ${className}`}>
      {/* Header: Filtros and Limpar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <h3 className="text-base font-bold text-slate-900">Filtros</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-violet-700 transition-colors cursor-pointer"
        >
          Limpar
        </button>
      </div>

      <div className="space-y-6">
        {/* Veículos Blindados Toggle matching Reference 1 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800">Veículos Blindados</span>
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
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
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

        {/* Marcas */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
            Marcas
          </label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {availableBrands.map(({ name, count }) => {
              const isChecked = filters.marcas.includes(name);
              return (
                <label
                  key={name}
                  className="flex items-center justify-between py-1 px-1 rounded-md hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(name)}
                      className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer accent-[#5B21B6]"
                    />
                    <span className={isChecked ? 'font-semibold text-slate-900' : ''}>{name}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">({count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Faixa de Preço matching Reference 1 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Faixa de Preço
            </label>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2">
            <span>R$ 0</span>
            <span className="text-violet-700 font-semibold">{formatCurrency(currentMaxPrice)}</span>
          </div>

          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={currentMaxPrice}
              onChange={handlePriceChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
            />
          </div>
        </div>

        {/* Ano (Min e Máx dropdowns side-by-side matching Reference 1) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Ano
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                value={filters.minAno || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minAno: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:border-violet-600 cursor-pointer"
              >
                <option value="">Min</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={`min-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filters.maxAno || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxAno: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:border-violet-600 cursor-pointer"
              >
                <option value="">Máx</option>
                {YEAR_OPTIONS.map((year) => (
                  <option key={`max-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Combustível */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:border-violet-600 cursor-pointer"
          >
            {FUEL_OPTIONS.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Transmissão */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-hidden focus:border-violet-600 cursor-pointer"
          >
            {TRANSMISSION_OPTIONS.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};
