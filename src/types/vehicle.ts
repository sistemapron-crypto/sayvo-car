export type FuelType = 'Flex' | 'Gasolina' | 'Diesel' | 'Híbrido' | 'Elétrico' | 'Álcool' | 'Não informado';
export type TransmissionType = 'Manual' | 'Automático' | 'CVT' | 'Automatizado' | 'Não informado';
export type CategoryType = 'SUV' | 'Hatch' | 'Sedan' | 'Picape' | 'Esportivo' | 'Blindado';

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versão: string;
  ano: number;
  quilometragem: number;
  preço: number;
  combustível: FuelType;
  transmissão: TransmissionType;
  cor: string;
  imagens: string[];
  destaque: boolean;
  disponível: boolean;
  blindado: boolean;
  descrição: string;
  placaFinal?: string;
  visualizações: number;
  categoria?: CategoryType;
  opcionais?: string[];
  motor?: string;
  potência?: string;
}

export interface VehicleFilters {
  searchQuery: string;
  marcas: string[];
  blindadoOnly: boolean;
  minPrice?: number;
  maxPrice?: number;
  minAno?: number;
  maxAno?: number;
  combustível?: string;
  transmissão?: string;
  sortBy?: 'recent' | 'price_asc' | 'price_desc' | 'km_asc' | 'year_desc';
}

export interface SellCarFormData {
  nome: string;
  telefone: string;
  email?: string;
  cidade?: string;
  marca: string;
  modelo: string;
  ano: string;
  quilometragem: string;
  versao?: string;
  precoPretendido?: string;
  observacoes?: string;
}
