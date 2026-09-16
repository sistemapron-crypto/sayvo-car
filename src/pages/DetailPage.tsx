import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, ShieldCheck, MessageCircle, Share2, Heart } from 'lucide-react';
import { Vehicle } from '../types/vehicle';
import { VehicleGallery } from '../components/details/VehicleGallery';
import { PriceCard } from '../components/details/PriceCard';
import { VehicleSpecifications } from '../components/details/VehicleSpecifications';
import { InterestModal } from '../components/details/InterestModal';
import { getStoreConfig } from '../services/storeService';
import { createWhatsAppUrl, formatCurrency } from '../utils/formatters';

interface DetailPageProps {
  vehicle: Vehicle;
  onBackToStock: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  vehicle,
  onBackToStock,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [storeWhatsapp, setStoreWhatsapp] = useState('');
  const [storeName, setStoreName] = useState('');

  React.useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setStoreWhatsapp(config.whatsapp || '');
        setStoreName(config.nomeLoja || '');
      })
      .catch((error) => {
        console.error('Erro ao carregar configuração da loja:', error);
      });
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${vehicle.marca} ${vehicle.modelo} - ${storeName}`,
          text: `Confira este ${vehicle.modelo} ${vehicle.versão} na ${storeName}`,
          url: window.location.href,
        })
        .catch(() => { });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleDirectWhatsApp = () => {
    const message = `Olá! Tenho interesse no ${vehicle.marca} ${vehicle.modelo} ${vehicle.versão} (${vehicle.ano}) anunciado por ${formatCurrency(vehicle.preço)} na ${storeName}. Está disponível?`;
    const url = createWhatsAppUrl(storeWhatsapp, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-16 pt-4 sm:pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: "Voltar para Estoque" matching Reference 3 */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBackToStock}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[var(--cor-primaria)] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Voltar para Estoque</span>
          </button>

          {/* Quick Actions (Share & Favorite) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Compartilhar veículo"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedToast ? 'Link copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => onToggleFavorite(vehicle.id, e)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar veículo'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Composition matching Reference 3:
            Left: Gallery
            Right: Details, Price, Specs, CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery matching Reference 3 */}
          <div className="lg:col-span-7">
            <VehicleGallery
              images={vehicle.imagens}
              vehicleTitle={`${vehicle.marca} ${vehicle.modelo}`}
            />

            {/* Vehicle Description Section */}
            {vehicle.descrição && (
              <div className="mt-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  Sobre este veículo
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {vehicle.descrição}
                </p>
              </div>
            )}

            {/* Vehicle Features / Optionals List */}
            {vehicle.opcionais && vehicle.opcionais.length > 0 && (
              <div className="mt-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Itens de Série e Opcionais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.opcionais.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Vehicle Info matching Reference 3 */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Title: Marca/Modelo */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight capitalize">
                {vehicle.modelo}
              </h1>

              {/* Version + Status Disponível badge matching Reference 3 */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  {vehicle.versão}
                </span>

                {vehicle.disponível && (
                  <span
                    className="text-white text-xs px-3 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: 'var(--cor-primaria)' }}
                  >
                    Disponível
                  </span>
                )}
              </div>

              {/* Secondary Badges Row matching Reference 3:
                  [eye] 1 pessoa viu hoje | [check] Veículo verificado */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <div className="bg-slate-100/90 text-slate-600 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>1 pessoa viu hoje</span>
                </div>

                <div className="bg-slate-100/90 text-slate-600 text-xs px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Veículo verificado</span>
                </div>
              </div>
            </div>

            {/* Price Box matching Reference 3: Dark navy with big price & "Preço à vista" */}
            <PriceCard price={vehicle.preço} />

            {/* Specifications Card matching Reference 3 */}
            <VehicleSpecifications vehicle={vehicle} />

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              {/* Primary Contact WhatsApp CTA */}
              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Falar com Vendedor no WhatsApp</span>
              </button>

              {/* Secondary Interest / Proposal CTA */}
              <button
                type="button"
                onClick={() => setIsInterestModalOpen(true)}
                className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 active:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors text-center cursor-pointer shadow-xs"
              >
                Tenho Interesse / Enviar Proposta
              </button>
            </div>

            {/* Trust and Safety Banner */}
            <div
              className="p-4 rounded-xl text-xs flex items-start gap-3"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--cor-primaria) 8%, white)',
                border: '1px solid color-mix(in srgb, var(--cor-primaria) 20%, white)',
                color: 'var(--cor-primaria)',
              }}
            >
              <ShieldCheck
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: 'var(--cor-primaria)' }}
              />
              <div>
                <p className="font-bold">Garantia {storeName}</p>
                <p
                  className="mt-0.5"
                  style={{ color: 'var(--cor-primaria)' }}
                >
                  Laudo pericial 100% aprovado, quilometragem original e garantia mecânica.
                  Aceitamos seu veículo seminovo na troca com a melhor avaliação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest / Contact Modal */}
      <InterestModal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        vehicle={vehicle}
      />
    </main>
  );
};
