import React, { useState } from 'react';
import { X, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { STORE_SETTINGS } from '../../data/vehicles';
import { createWhatsAppUrl, formatCurrency } from '../../utils/formatters';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
}

export const InterestModal: React.FC<InterestModalProps> = ({
  isOpen,
  onClose,
  vehicle,
}) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [comTroca, setComTroca] = useState(false);
  const [mensagem, setMensagem] = useState(
    `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.versão} (${vehicle.ano}) por ${formatCurrency(vehicle.preço)}.`
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const tradeText = comTroca ? ' (Possuo veículo para troca)' : '';
    const fullMessage = `${mensagem}${tradeText}\nMeu contato: ${nome} - ${telefone}`;
    const url = createWhatsAppUrl(STORE_SETTINGS.whatsapp, fullMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Falar com o Vendedor</h3>
            <p className="text-xs text-slate-500">Atendimento rápido e sem burocracia</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Mensagem Iniciada!</h4>
            <p className="text-xs text-slate-500">
              Você está sendo redirecionado para o WhatsApp da Ronimotors Automóveis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4">
            {/* Vehicle Summary mini box */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={vehicle.imagens[0]}
                alt={vehicle.modelo}
                className="w-14 h-12 object-cover rounded-lg shrink-0"
              />
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-900 truncate">
                  {vehicle.marca} {vehicle.modelo} {vehicle.versão}
                </span>
                <span className="block text-xs font-extrabold text-[#059669]">
                  {formatCurrency(vehicle.preço)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seu Nome Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-violet-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Seu Telefone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-violet-600"
              />
            </div>

            <label className="flex items-center gap-2.5 py-1 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={comTroca}
                onChange={(e) => setComTroca(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-[#5B21B6]"
              />
              <span>Tenho um veículo para dar na troca</span>
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mensagem
              </label>
              <textarea
                rows={2}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-violet-600 resize-none text-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#059669] hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar via WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
