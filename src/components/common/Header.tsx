import React, { useEffect, useState } from 'react';
import { Car, PhoneCall } from 'lucide-react';
import { RonimotorsLogo } from './RonimotorsLogo';
import { getStoreConfig } from '../../services/storeService';

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

  const [whatsapp, setWhatsapp] = useState('');
  const [nomeLoja, setNomeLoja] = useState('');

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setWhatsapp(config.whatsapp || '');
        setNomeLoja(config.nomeLoja || '');
      })
      .catch((error) => {
        console.error('Erro ao carregar configurações da loja:', error);
      });
  }, []);

  return (
    <header className="relative z-40 bg-gradient-to-b from-black/80 via-black/50 to-transparent backdrop-blur-md border-b border-white/10 transition-shadow">
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
              className={`flex items-center gap-2 text-sm font-semibold transition-colors py-2 px-1 relative cursor-pointer ${isVehiclesActive
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
              href={`tel:${whatsapp.replace(/\D/g, '')}`}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-violet-700 transition-colors px-3 py-2 rounded-lg bg-slate-50 hover:bg-violet-50 border border-slate-200/80 shadow-2xs"
            >
              <PhoneCall className="w-4 h-4 text-violet-600" />
              <span className="hidden sm:inline">{whatsapp}</span>
              <span className="sm:hidden">Ligar</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
