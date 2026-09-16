import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, Phone, ShieldCheck, ExternalLink } from 'lucide-react';
import { STORE_SETTINGS } from '../../data/vehicles';
import { getStoreConfig } from '../../services/storeService';

export interface LocationSectionProps {
  name?: string;
  address?: string;
  hours?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
  className?: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  name = STORE_SETTINGS.name,
  address = STORE_SETTINGS.address,
  hours = STORE_SETTINGS.hours,
  phoneDisplay = STORE_SETTINGS.phoneDisplay,
  coordinates = STORE_SETTINGS.coordinates,
  googleMapsUrl,
  className = '',
}) => {
  const [nomeLoja, setNomeLoja] = useState(name);
  const [whatsapp, setWhatsapp] = useState(phoneDisplay);
  const [horario, setHorario] = useState(hours);
  const [enderecoLoja, setEnderecoLoja] = useState(address);
  const [coordenadasLoja, setCoordenadasLoja] = useState(coordinates);

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setNomeLoja(config.nomeLoja || name);
        setWhatsapp(config.whatsapp || phoneDisplay);
        setHorario(
          config.retiradaHoraInicio && config.retiradaHoraFim
            ? `${config.retiradaHoraInicio} às ${config.retiradaHoraFim}`
            : hours
        );
        setEnderecoLoja(config.endereco || address);
        if (
          typeof config.latitude === 'number' &&
          typeof config.longitude === 'number'
        ) {
          setCoordenadasLoja({
            lat: config.latitude,
            lng: config.longitude,
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao carregar configurações da loja:', error);
      });
  }, [name, phoneDisplay, hours]);

  // Query param dynamically prioritized: coordinates (lat,lng) or text address
  // Query param dynamically prioritized: coordinates (lat,lng) or text address
  const queryParam = coordenadasLoja
  ? `${coordenadasLoja.lat},${coordenadasLoja.lng}`
  : encodeURIComponent(`${nomeLoja}, ${enderecoLoja}`);

  // Interactive Google Map iframe URL (no API key required, embed mode)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${queryParam}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  // "Como chegar" directions route URL
  const directionsUrl =
  googleMapsUrl ||
  (coordenadasLoja
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordenadasLoja.lat},${coordenadasLoja.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${nomeLoja}, ${enderecoLoja}`)}`);

  return (
    <section
      id="onde-estamos"
      className={`py-16 sm:py-20 bg-white border-t border-slate-200/80 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold text-[var(--cor-primaria)] tracking-wider uppercase">
            Localização
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Onde estamos
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Venha conhecer nosso showroom e tomar um café conosco. Veículos selecionados,
            atendimento personalizado e estrutura completa para a melhor experiência.
          </p>
        </div>

        {/* Responsive Grid: Desktop side-by-side, Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Store Information */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50/80 rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
            <div className="space-y-6">
              {/* Store Title & Badge */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[color-mix(in_srgb,var(--cor-primaria)_10%,white)] text-[var(--cor-primaria)] flex items-center justify-center shrink-0 shadow-2xs">
                  <MapPin className="w-6 h-6 text-[var(--cor-primaria)]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{nomeLoja}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showroom & Atendimento ao Cliente
                  </p>
                </div>
              </div>

              {/* Information List */}
              <div className="space-y-4 pt-2 border-t border-slate-200/80">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[var(--cor-primaria)] shrink-0 mt-1" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Endereço
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-relaxed">
                      {enderecoLoja}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--cor-primaria)] shrink-0 mt-1" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Horário de Funcionamento
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {horario}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[var(--cor-primaria)] shrink-0 mt-1" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Telefone & WhatsApp
                    </span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">
                      {whatsapp}
                    </p>
                  </div>
                </div>

                {/* Facilities */}
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <div>
                    <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Comodidades
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Estacionamento privativo para clientes no local e showroom climatizado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA: "Como chegar" */}
            <div className="pt-6 mt-6 border-t border-slate-200/80">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[var(--cor-primaria)] hover:brightness-95 active:brightness-90 text-white font-bold text-sm rounded-xl transition-colors shadow-md hover:shadow-lg cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Como chegar</span>
              </a>
            </div>
          </div>

          {/* Right Column: Large visually integrated Map */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs bg-slate-100 min-h-[380px] sm:min-h-[460px] h-full flex">
              {/* Map iFrame */}
              <iframe
                title="Mapa de Localização da Ronimotors Automóveis"
                src={mapEmbedUrl}
                className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Top-Left Location Overlay Card */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2.5 pointer-events-none max-w-[280px]">
                <div className="w-8 h-8 rounded-lg bg-[var(--cor-primaria)] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{nomeLoja}</p>
                  <p className="text-[11px] text-slate-500 truncate">{enderecoLoja}</p>
                </div>
              </div>

              {/* Bottom-Right "Abrir no Google Maps" Direct Link */}
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-md flex items-center gap-1.5 transition-colors"
              >
                <span>Ver no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
