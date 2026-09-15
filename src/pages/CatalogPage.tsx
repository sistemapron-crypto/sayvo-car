import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { StockBanner } from '../components/catalog/StockBanner';
import { LocationSection } from '../components/home/LocationSection';
import { SearchBar } from '../components/catalog/SearchBar';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { MobileFiltersModal } from '../components/catalog/MobileFiltersModal';
import { VehicleGrid } from '../components/catalog/VehicleGrid';
import { Vehicle, VehicleFilters } from '../types/vehicle';
import { vehicleService } from '../services/vehicleService';

interface CatalogPageProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onNavigateHome?: () => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  initialFilters?: Partial<VehicleFilters>;
}

const DEFAULT_FILTERS: VehicleFilters = {
  searchQuery: '',
  marcas: [],
  blindadoOnly: false,
  minPrice: 0,
  maxPrice: 1000000,
  minAno: undefined,
  maxAno: undefined,
  combustível: 'Todos',
  transmissão: 'Todas',
};

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onSelectVehicle,
  onNavigateHome,
  favorites,
  onToggleFavorite,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<VehicleFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [availableBrands, setAvailableBrands] = useState<{ name: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Load brands on mount
  useEffect(() => {
    vehicleService.getAvailableBrands().then(setAvailableBrands);
    vehicleService.getTotalVehiclesCount().then(setTotalCount);
  }, []);

  // Fetch vehicles whenever filters change
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);

    vehicleService
      .getVehicles(filters)
      .then((data) => {
        if (isCurrent) {
          setVehicles(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    filters.marcas.length +
    (filters.blindadoOnly ? 1 : 0) +
    (filters.maxPrice && filters.maxPrice < 1000000 ? 1 : 0) +
    (filters.minAno ? 1 : 0) +
    (filters.maxAno ? 1 : 0) +
    (filters.combustível && filters.combustível !== 'Todos' ? 1 : 0) +
    (filters.transmissão && filters.transmissão !== 'Todas' ? 1 : 0);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-16">
      {/* Visual Automotive Banner between Header and Stock */}
      <div className="-mt-20">
        <StockBanner />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Estoque de Veículos', active: true }]}
          onHomeClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (onNavigateHome) onNavigateHome();
          }}
        />

        {/* Page Title: "Nosso Estoque" */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-6">
          Nosso Estoque
        </h1>

        {/* Mobile Search and Filter Button Row matching Reference 2 */}
        <div className="md:hidden mb-4">
          <SearchBar
            value={filters.searchQuery}
            onChange={(val) => setFilters((prev) => ({ ...prev, searchQuery: val }))}
            onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
            showFilterButton={true}
          />
        </div>

        {/* Mobile Vehicle Counter matching Reference 2 */}
        <div className="md:hidden text-xs sm:text-sm text-slate-500 font-medium mb-3">
          Mostrando {vehicles.length} de {totalCount} veículos
        </div>

        {/* Main Grid: Left Column Filters + Right Column Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Left Column Filters matching Reference 1 */}
          <div className="hidden md:block md:col-span-1 space-y-4">
            {/* Desktop Search bar directly above filters matching Reference 1 */}
            <SearchBar
              value={filters.searchQuery}
              onChange={(val) => setFilters((prev) => ({ ...prev, searchQuery: val }))}
              showFilterButton={false}
            />

            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              availableBrands={availableBrands}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Column: Counter + Vehicles Grid */}
          <div className="md:col-span-3">
            {/* Desktop Counter matching Reference 1 */}
            <div className="hidden md:flex items-center justify-between text-xs sm:text-sm text-slate-500 font-medium mb-4">
              <span>
                Mostrando {vehicles.length} de {totalCount} veículos
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-violet-700 hover:text-violet-900 font-semibold cursor-pointer"
                >
                  Limpar {activeFilterCount} {activeFilterCount === 1 ? 'filtro' : 'filtros'}
                </button>
              )}
            </div>

            {/* Vehicles Grid / Mobile List */}
            <VehicleGrid
              vehicles={vehicles}
              isLoading={isLoading}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectVehicle={onSelectVehicle}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      <MobileFiltersModal
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        filters={filters}
        onChange={setFilters}
        availableBrands={availableBrands}
        onReset={handleResetFilters}
        totalFilteredCount={vehicles.length}
      />

      {/* Onde estamos / Localização & Showroom */}
      <LocationSection className="mt-16" />
    </main>
  );
};
