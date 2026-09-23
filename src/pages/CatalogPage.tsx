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
import { VehicleCardDesktop } from '../components/catalog/VehicleCardDesktop';

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
  const [availableBrands, setAvailableBrands] = useState<
    { name: string; count: number }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);

  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] =
    useState<boolean>(true);

  // =========================================================
  // CARREGAMENTO INICIAL
  // =========================================================

  useEffect(() => {
    vehicleService
      .getAvailableBrands()
      .then(setAvailableBrands);

    vehicleService
      .getTotalVehiclesCount()
      .then(setTotalCount);

    setIsLoadingFeatured(true);

    vehicleService
      .getFeaturedVehicles()
      .then((data) => {
        setFeaturedVehicles(data);
        setIsLoadingFeatured(false);
      })
      .catch(() => {
        setFeaturedVehicles([]);
        setIsLoadingFeatured(false);
      });
  }, []);

  // =========================================================
  // CARREGAR ESTOQUE CONFORME OS FILTROS
  // =========================================================

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
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [filters]);

  // =========================================================
  // RESETAR FILTROS
  // =========================================================

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // =========================================================
  // CONTADOR DE FILTROS
  // =========================================================

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    filters.marcas.length +
    (filters.blindadoOnly ? 1 : 0) +
    (filters.maxPrice && filters.maxPrice < 1000000 ? 1 : 0) +
    (filters.minAno ? 1 : 0) +
    (filters.maxAno ? 1 : 0) +
    (filters.combustível &&
    filters.combustível !== 'Todos'
      ? 1
      : 0) +
    (filters.transmissão &&
    filters.transmissão !== 'Todas'
      ? 1
      : 0);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-16">

      {/* =====================================================
          BANNER
      ====================================================== */}

      <div className="-mt-20">
        <StockBanner />
      </div>

      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            {
              label: 'Estoque de Veículos',
              active: true,
            },
          ]}
          onHomeClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });

            if (onNavigateHome) {
              onNavigateHome();
            }
          }}
        />

        {/* Título principal */}
        <h1 className="text-1xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1 mb-6">
          SEU PRÓXIMO CARRO ESTÁ AQUI
        </h1>

        {/* ===================================================
            BUSCA MOBILE
        ==================================================== */}

        <div className="md:hidden mb-4">
          <SearchBar
            value={filters.searchQuery}
            onChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                searchQuery: val,
              }))
            }
            onOpenMobileFilters={() =>
              setIsMobileFiltersOpen(true)
            }
            activeFilterCount={activeFilterCount}
            showFilterButton={true}
          />
        </div>

        {/* Contador mobile */}
        <div className="md:hidden text-xs sm:text-sm text-slate-500 font-medium mb-3">
          Mostrando {vehicles.length} de {totalCount} veículos
        </div>

        {/* ===================================================
            ÁREA DE BUSCA + FILTROS + ESTOQUE
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 items-start">

          {/* =================================================
              FILTROS DESKTOP
          ================================================== */}

          <div className="hidden md:block md:col-span-1 space-y-4">

            {/* Busca */}
            <SearchBar
              value={filters.searchQuery}
              onChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  searchQuery: val,
                }))
              }
              showFilterButton={false}
            />

            {/* Filtros */}
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              availableBrands={availableBrands}
              onReset={handleResetFilters}
            />

          </div>

          {/* =================================================
              CONTEÚDO DOS VEÍCULOS
          ================================================== */}

          <div className="md:col-span-3">

            {/* =================================================
                VEÍCULOS EM DESTAQUE
            ================================================== */}

            {!isLoadingFeatured &&
              featuredVehicles.length > 0 && (
                <section className="mb-10">

                  <div className="flex items-end justify-between mb-5">
                    <div>

                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--cor-primaria)]">
                        Seleção especial
                      </span>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                        Veículos em destaque
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        Confira os veículos selecionados pela nossa equipe.
                      </p>

                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden -mx-4 px-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                    <div className="flex gap-4">

                      {featuredVehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="w-[86vw] max-w-[360px] shrink-0 snap-start"
                        >
                          <VehicleCardDesktop
                            vehicle={vehicle}
                            onSelect={onSelectVehicle}
                          />
                        </div>
                      ))}

                    </div>
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">

                    {featuredVehicles.map((vehicle) => (
                      <VehicleCardDesktop
                        key={vehicle.id}
                        vehicle={vehicle}
                        onSelect={onSelectVehicle}
                      />
                    ))}

                  </div>

                </section>
              )}

            {/* =================================================
                CABEÇALHO DO ESTOQUE NORMAL
            ================================================== */}

            <div className="flex items-end justify-between mb-5">

              <div>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  Estoque de veículos
                </h2>

              </div>

            </div>

            {/* =================================================
                CONTADOR DESKTOP
            ================================================== */}

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
                  Limpar {activeFilterCount}{' '}
                  {activeFilterCount === 1
                    ? 'filtro'
                    : 'filtros'}
                </button>
              )}

            </div>

            {/* =================================================
                ESTOQUE NORMAL
            ================================================== */}

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

      {/* =====================================================
          FILTROS MOBILE
      ====================================================== */}

      <MobileFiltersModal
        isOpen={isMobileFiltersOpen}
        onClose={() =>
          setIsMobileFiltersOpen(false)
        }
        filters={filters}
        onChange={setFilters}
        availableBrands={availableBrands}
        onReset={handleResetFilters}
        totalFilteredCount={vehicles.length}
      />

      {/* =====================================================
          LOCALIZAÇÃO / SHOWROOM
      ====================================================== */}

      <LocationSection className="mt-16" />

    </main>
  );
};