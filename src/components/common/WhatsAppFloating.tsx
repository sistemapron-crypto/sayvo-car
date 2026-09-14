import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_SETTINGS } from '../../data/vehicles';
import { createWhatsAppUrl } from '../../utils/formatters';

interface WhatsAppFloatingProps {
  vehicleContext?: {
    marca: string;
    modelo: string;
    versão: string;
    ano: number;
    preço: number;
  };
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ vehicleContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const defaultMessage = vehicleContext
    ? `Olá! Tenho interesse no ${vehicleContext.marca} ${vehicleContext.modelo} ${vehicleContext.versão} (${vehicleContext.ano}) anunciado na Ronimotors.`
    : 'Olá! Gostaria de mais informações sobre os veículos disponíveis no estoque da Ronimotors.';

  const handleOpenWhatsApp = (customMsg?: string) => {
    const msgToSend = customMsg || quickMessage || defaultMessage;
    const url = createWhatsAppUrl(STORE_SETTINGS.whatsapp, msgToSend);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex flex-col items-end pointer-events-auto">
      {/* Quick Chat Popup (if expanded) */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#5B21B6] px-4 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-sm font-semibold leading-tight">Ronimotors Atendimento</h4>
                <p className="text-[11px] text-violet-200">Online agora no WhatsApp</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-xs shadow-2xs border border-slate-100 text-xs text-slate-700">
              {defaultMessage}
            </div>

            <textarea
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="Digite sua mensagem personalizada..."
              className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-violet-600 resize-none h-18 text-slate-800"
            />

            <button
              type="button"
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Iniciar conversa no WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button & Pill like Reference 1 & 2 */}
      <div className="flex items-center gap-2">
        {/* Pill "Posso ajudar? 💬" */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="hidden sm:flex items-center gap-1.5 bg-[#5013e8] text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-md hover:bg-violet-700 transition-all cursor-pointer active:scale-95"
        >
          <span>Posso ajudar?</span>
          <span className="text-sm">💬</span>
        </button>

        {/* Circular Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#5013e8] hover:bg-violet-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer group"
          aria-label="Atendimento no WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:rotate-6 transition-transform" />
        </button>
      </div>
    </div>
  );
};
