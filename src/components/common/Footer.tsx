import React from 'react';
import { RonimotorsLogo } from './RonimotorsLogo';
import { STORE_SETTINGS } from '../../data/vehicles';
import { MapPin, Phone, Clock, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand info */}
          <div className="space-y-4">
            <div className="bg-white inline-block px-3 py-1.5 rounded-lg">
              <RonimotorsLogo size="sm" />
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Excelência e transparência no comércio de veículos seminovos e novos. Todos os nossos carros
              possuem laudo cautelar aprovado e garantia de procedência.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% dos veículos periciados</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nosso Estoque de Veículos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('onde-estamos');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onNavigate('/');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Localização & Showroom
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Onde Estamos
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span>{STORE_SETTINGS.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <span>{STORE_SETTINGS.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <span>{STORE_SETTINGS.email}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Horário & Atendimento */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Horário de Funcionamento
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span>{STORE_SETTINGS.hours}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                Agende uma visita ou faça um test-drive diretamente pelo nosso WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Ronimotors Automóveis. Todos os direitos reservados.</p>
          <p className="text-[11px] text-slate-600">
            Imagens meramente ilustrativas. Reservamo-nos o direito de corrigir eventuais erros de digitação.
          </p>
        </div>
      </div>
    </footer>
  );
};
