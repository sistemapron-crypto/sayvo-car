/**
 * Formatting utilities for Brazilian automotive market standards
 */

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKm(value: number): string {
  return `${new Intl.NumberFormat('pt-BR').format(value)} km`;
}

export function formatPlate(plate?: string): string {
  if (!plate) return '***-****';
  return plate;
}

export function createWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
