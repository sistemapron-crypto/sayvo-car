import React, { useEffect, useState } from 'react';
import { Car, PhoneCall } from 'lucide-react';
import { getStoreConfig } from '../../services/storeService';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenLogin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setWhatsapp(config.whatsapp || '');
      })
      .catch((error) => {
        console.error('Erro ao carregar WhatsApp:', error);
      });
  }, []);
  const isVehiclesActive = currentRoute === '/' || currentRoute.startsWith('/veiculo');

  return (
    <nav
      aria-label="Navegação Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-2 h-16 max-w-sm mx-auto items-center">
        {/* Veículos */}
        <button
          type="button"
          onClick={() => {
            onNavigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full transition-colors ${isVehiclesActive
              ? 'text-violet-700 font-semibold'
              : 'text-slate-500 hover:text-slate-950 font-medium'
            }`}
        >
          <Car
            className={`w-5 h-5 mb-1 ${isVehiclesActive ? 'stroke-[2.2px] text-violet-700' : 'text-slate-500'
              }`}
          />
          <span className="text-xs font-medium">Veículos</span>
        </button>

        {/* Contato / Ligar */}
        <a
          href={`tel:${whatsapp.replace(/\D/g, '')}`}
          className="flex flex-col items-center justify-center h-full text-slate-500 hover:text-violet-700 font-medium transition-colors"
        >
          <PhoneCall className="w-5 h-5 mb-1 text-slate-500" />
          <span className="text-xs font-medium">Ligar</span>
        </a>
      </div>
    </nav>
  );
};
