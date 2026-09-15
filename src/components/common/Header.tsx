import React, { useEffect, useState } from 'react';
import { Car, PhoneCall, Menu, X } from 'lucide-react';
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
  const [corPrimaria, setCorPrimaria] = useState('#aeee02');
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setWhatsapp(config.whatsapp || '');
        setCorPrimaria(config.corPrimaria || '#aeee02');
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
                ? 'text-[var(--cor-primaria)] font-semibold'
                : 'text-slate-600 hover:text-slate-950'
                }`}
            >
              <Car
                className="w-4 h-4"
                style={{ color: corPrimaria }}
              />
              <span>Veículos</span>
              {isVehiclesActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: corPrimaria }}
                />
              )}
            </button>
          </nav>

          {/* Right Area: Store Phone Contact */}
          <div className="flex items-center gap-3">
            {/* Desktop */}
            <a
              href={`tel:${whatsapp.replace(/\D/g, '')}`}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[var(--cor-primaria)] transition-colors px-3 py-2 rounded-lg bg-slate-50 hover:bg-[color-mix(in_srgb,var(--cor-primaria)_8%,white)] border border-slate-200/80 shadow-2xs"
            >
              <PhoneCall
                className="w-4 h-4"
                style={{ color: corPrimaria }}
              />
              <span>{whatsapp}</span>
            </a>

            {/* Mobile */}
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white transition-colors"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            >
              {menuAberto ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Contact Menu */}
            {menuAberto && (
              <div className="absolute top-full right-4 mt-2 w-44 rounded-xl bg-black border border-white/10 shadow-lg overflow-hidden sm:hidden">
                <a
                  href={`tel:${whatsapp.replace(/\D/g, '')}`}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <PhoneCall
                    className="w-4 h-4"
                    style={{ color: corPrimaria }}
                  />
                  <span>Ligar</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
