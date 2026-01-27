/**
 * Currency utilities for FCFA formatting
 */

export function formatFCFA(amount: number): string {
  return `${amount.toLocaleString()} FCFA`;
}

export function parseFCFA(formattedAmount: string): number {
  // Remove "FCFA" and any non-numeric characters except commas and dots
  const numericString = formattedAmount.replace(/[^0-9.,]/g, '').replace(/,/g, '');
  return parseFloat(numericString) || 0;
}

export function getCurrencySymbol(): string {
  return 'FCFA';
}

export function getCurrencyCode(): string {
  return 'XOF';
}

// Default currency for the application
export const DEFAULT_CURRENCY = {
  code: 'XOF',
  symbol: 'FCFA',
  name: 'West African CFA Franc'
};
