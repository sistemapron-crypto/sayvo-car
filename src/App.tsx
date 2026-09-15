import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { WhatsAppFloating } from './components/common/WhatsAppFloating';
import { LoginModal } from './components/auth/LoginModal';
import { CatalogPage } from './pages/CatalogPage';
import { DetailPage } from './pages/DetailPage';
import { Vehicle, VehicleFilters } from './types/vehicle';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [initialCatalogFilters, setInitialCatalogFilters] = useState<Partial<VehicleFilters>>({});
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ronimotors_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ronimotors_favorites', JSON.stringify(favorites));
    } catch {
      // Ignore localStorage errors
    }
  }, [favorites]);

  // Handle route navigation
  const navigateTo = (route: string, vehicle?: Vehicle, filters?: Partial<VehicleFilters>) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (vehicle) {
      setSelectedVehicle(vehicle);
    }
    if (filters) {
      setInitialCatalogFilters(filters);
    }
    setCurrentRoute(route);
  };

  const toggleFavorite = (vehicleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentRoute(`/veiculo/${vehicle.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-900 selection:bg-violet-100 selection:text-violet-900">
      {/* Top Header */}
      {/* Top Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header
          currentRoute={currentRoute}
          onNavigate={(route) => navigateTo(route)}
          onOpenLogin={() => setIsLoginOpen(true)}
        />

        <div
          className="w-full h-[4px]"
          style={{ backgroundColor: '#FF5F1F' }}
        />
      </div>

      {/* Main Page Content */}
      <div className="flex-1">
        {currentRoute.startsWith('/veiculo/') && selectedVehicle ? (
          <DetailPage
            vehicle={selectedVehicle}
            onBackToStock={() => navigateTo('/')}
            isFavorite={favorites.includes(selectedVehicle.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <CatalogPage
            onSelectVehicle={handleSelectVehicle}
            onNavigateHome={() => navigateTo('/')}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            initialFilters={initialCatalogFilters}
          />
        )}
      </div>

      {/* Footer */}
      <Footer onNavigate={(route) => navigateTo(route)} />

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={(route) => navigateTo(route)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Floating WhatsApp Action */}
      <WhatsAppFloating
        vehicleContext={
          selectedVehicle && currentRoute.startsWith('/veiculo/')
            ? {
              marca: selectedVehicle.marca,
              modelo: selectedVehicle.modelo,
              versão: selectedVehicle.versão,
              ano: selectedVehicle.ano,
              preço: selectedVehicle.preço,
            }
            : undefined
        }
      />

      {/* Login Portal Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}
