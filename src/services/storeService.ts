import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firestore';

export interface StoreConfig {
  nomeLoja?: string;
  whatsapp?: string;
  bannerUrl?: string;
  bannerTitulo?: string;
  bannerSubtitulo?: string;
  bannerPosicao?: string;
  logoUrl?: string;
  logoTamanho?: number;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  corPrimaria?: string;
  corSecundaria?: string;
  corDestaque?: string;
  retiradaDias?: number[];
  retiradaHoraInicio?: string;
  retiradaHoraFim?: string;
  retiradaIntervalo?: number;
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const snapshot = await getDoc(doc(db, 'configuracoes', 'geral'));

  if (!snapshot.exists()) {
    return {};
  }

  return snapshot.data() as StoreConfig;
}