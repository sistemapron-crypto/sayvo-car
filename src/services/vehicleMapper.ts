import {
  Vehicle,
  FuelType,
  TransmissionType,
  CategoryType,
} from '../types/vehicle';

interface FirebaseProduct {
  id?: number | string;
  nome?: string;
  categoria?: string;
  preco?: number | string;
  imagem?: string;
  imagens?: string[];
  descricao?: string;
  ativo?: boolean;
  destaque?: boolean;
  marca?: string;
  modelo?: string;
  versao?: string;
  anoFabricacao?: number | null;
  anoModelo?: number | null;
  km?: number | string;
  cambio?: string;
  combustivel?: string;
  cor?: string;
}

const VALID_FUELS: FuelType[] = [
  'Flex',
  'Gasolina',
  'Diesel',
  'Híbrido',
  'Elétrico',
  'Álcool',
];

const VALID_TRANSMISSIONS: TransmissionType[] = [
  'Manual',
  'Automático',
  'CVT',
  'Automatizado',
];

const VALID_CATEGORIES: CategoryType[] = [
  'SUV',
  'Hatch',
  'Sedan',
  'Picape',
  'Esportivo',
  'Blindado',
];

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '');

    const number = Number(normalized);

    return Number.isFinite(number) ? number : 0;
  }

  return 0;
}

function normalizeFuel(value?: string): FuelType {
  return VALID_FUELS.includes(value as FuelType)
    ? (value as FuelType)
    : 'Não informado' as FuelType;
}

function normalizeTransmission(value?: string): TransmissionType {
  return VALID_TRANSMISSIONS.includes(value as TransmissionType)
    ? (value as TransmissionType)
    : 'Não informado' as TransmissionType;
}

function normalizeCategory(value?: string): CategoryType | undefined {
  return VALID_CATEGORIES.includes(value as CategoryType)
    ? (value as CategoryType)
    : undefined;
}

export function isVehicleProduct(product: FirebaseProduct): boolean {
  const marca = product.marca?.trim();
  const modelo = product.modelo?.trim();

  return Boolean(marca && modelo);
}

export function mapFirebaseProductToVehicle(
  product: FirebaseProduct
): Vehicle | null {
  if (!isVehicleProduct(product)) {
    return null;
  }

  const imagem = product.imagem?.trim();

  const imagens = Array.isArray(product.imagens)
    ? product.imagens.filter(
      (src): src is string =>
        typeof src === 'string' && src.trim() !== ''
    )
    : [];

  const ano =
    product.anoModelo ??
    product.anoFabricacao ??
    0;

  return {
    id: String(product.id ?? ''),
    marca: product.marca?.trim() || '',
    modelo: product.modelo?.trim() || product.nome?.trim() || '',
    versão: product.versao?.trim() || '',
    ano: normalizeNumber(ano),
    quilometragem: normalizeNumber(product.km),
    preço: normalizeNumber(product.preco),
    combustível: normalizeFuel(product.combustivel),
    transmissão: normalizeTransmission(product.cambio),
    cor: product.cor?.trim() || '',
    imagens: imagens.length > 0
      ? imagens
      : imagem
        ? [imagem]
        : [],
    destaque: product.destaque === true,
    disponível: product.ativo !== false,
    blindado: false,
    descrição: product.descricao?.trim() || '',
    visualizações: 0,
    categoria: normalizeCategory(product.categoria),
  };
}