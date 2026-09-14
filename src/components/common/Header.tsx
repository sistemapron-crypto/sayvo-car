import React from 'react';
import { Car, PhoneCall } from 'lucide-react';
import { RonimotorsLogo } from './RonimotorsLogo';
import { STORE_SETTINGS } from '../../data/vehicles';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const isVehiclesActive = currentRoute === '/' || currentRoute.startsWith('/veiculo');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-100 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus:outline-hidden group cursor-pointer"
          >
            <RonimotorsLogo size="md" />
          </button>

          {/* Center Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-1 relative cursor-pointer ${
                isVehiclesActive
                  ? 'text-violet-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Car className="w-4 h-4 text-violet-600" />
              <span>Veículos</span>
              {isVehiclesActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Right Area: Store Phone Contact */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${STORE_SETTINGS.phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-violet-700 transition-colors px-3 py-2 rounded-lg bg-slate-50 hover:bg-violet-50 border border-slate-200/80 shadow-2xs"
            >
              <PhoneCall className="w-4 h-4 text-violet-600" />
              <span className="hidden sm:inline">{STORE_SETTINGS.phoneDisplay}</span>
              <span className="sm:hidden">Ligar</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
