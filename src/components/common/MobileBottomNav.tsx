import React, { useEffect, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { getStoreConfig } from '../../services/storeService';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenLogin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = () => {
  const [horarioAberto, setHorarioAberto] = useState(false);

  const [retiradaDias, setRetiradaDias] = useState<number[]>([]);
  const [retiradaHoraInicio, setRetiradaHoraInicio] = useState('08:00');
  const [retiradaHoraFim, setRetiradaHoraFim] = useState('18:00');

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setRetiradaDias(
          config.retiradaDias || [0, 1, 2, 3, 4, 5, 6]
        );

        setRetiradaHoraInicio(
          config.retiradaHoraInicio || '08:00'
        );

        setRetiradaHoraFim(
          config.retiradaHoraFim || '18:00'
        );
      })
      .catch((error) => {
        console.error('Erro ao carregar horários:', error);
      });
  }, []);

  const diasSemana = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  return (
    <>
      {/* Modal de horários */}
      {horarioAberto && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/40 flex items-end"
          onClick={() => setHorarioAberto(false)}
        >
          <div
            className="w-full bg-white rounded-t-2xl p-5 pb-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Horário de atendimento
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Confira os horários da loja
                </p>
              </div>

              <button
                type="button"
                onClick={() => setHorarioAberto(false)}
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
                aria-label="Fechar horários"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              {diasSemana.map((dia, index) => {
                const aberto = retiradaDias.includes(index);

                return (
                  <div
                    key={dia}
                    className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {dia}
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        aberto
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {aberto
                        ? `${retiradaHoraInicio} às ${retiradaHoraFim}`
                        : 'Fechado'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navegação Mobile */}
      <nav
        aria-label="Navegação Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="grid grid-cols-2 h-16 max-w-sm mx-auto items-center">

          {/* Horários */}
          <button
            type="button"
            onClick={() => setHorarioAberto(true)}
            className="flex flex-col items-center justify-center h-full text-[var(--cor-primaria)] font-semibold transition-colors"
          >
            <Clock className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">
              Horários
            </span>
          </button>

          {/* Localização */}
          <button
            type="button"
            onClick={() => {
              const elemento =
                document.getElementById('onde-estamos');

              if (elemento) {
                elemento.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                });
              }
            }}
            className="flex flex-col items-center justify-center h-full text-[var(--cor-primaria)] font-semibold transition-colors"
          >
            <MapPin className="w-5 h-5 mb-1" />
            <span className="text-xs font-semibold">
              Localização
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};