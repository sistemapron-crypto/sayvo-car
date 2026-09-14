import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onOpenMobileFilters?: () => void;
  activeFilterCount?: number;
  className?: string;
  placeholder?: string;
  showFilterButton?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onOpenMobileFilters,
  activeFilterCount = 0,
  className = '',
  placeholder = 'Buscar veículo...',
  showFilterButton = false,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-violet-600 rounded-lg text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilterButton && onOpenMobileFilters && (
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="relative flex items-center justify-center p-2.5 h-[42px] w-[42px] bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 hover:text-slate-950 transition-colors focus:outline-hidden shrink-0 cursor-pointer shadow-2xs"
          aria-label="Abrir filtros"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#5B21B6] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};
