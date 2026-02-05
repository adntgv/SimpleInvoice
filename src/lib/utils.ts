import { v4 as uuidv4 } from 'uuid';
import { LineItem, InvoiceStatus } from './types';

const ANON_TOKEN_KEY = 'simpleinvoice_anon_token';
const ANON_COUNT_KEY = 'simpleinvoice_anon_count';
const MAX_FREE_INVOICES = 3;

export function getOrCreateAnonToken(): string {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem(ANON_TOKEN_KEY);
  if (!token) {
    token = uuidv4();
    localStorage.setItem(ANON_TOKEN_KEY, token);
    localStorage.setItem(ANON_COUNT_KEY, '0');
  }
  return token;
}

export function getAnonInvoiceCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(ANON_COUNT_KEY) || '0', 10);
}

export function incrementAnonCount(): void {
  if (typeof window === 'undefined') return;
  const count = getAnonInvoiceCount();
  localStorage.setItem(ANON_COUNT_KEY, String(count + 1));
}

export function canCreateInvoice(isAuthenticated: boolean): boolean {
  if (isAuthenticated) return true;
  return getAnonInvoiceCount() < MAX_FREE_INVOICES;
}

export function getRemainingFreeInvoices(): number {
  return Math.max(0, MAX_FREE_INVOICES - getAnonInvoiceCount());
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `INV-${y}${m}-${rand}`;
}

export function createEmptyLineItem(): LineItem {
  return {
    id: uuidv4(),
    description: '',
    quantity: 1,
    rate: 0,
    amount: 0,
  };
}

export function calculateLineItemAmount(item: LineItem): number {
  return Math.round(item.quantity * item.rate * 100) / 100;
}

export function calculateTotals(items: LineItem[], taxRate: number) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const roundedSubtotal = Math.round(subtotal * 100) / 100;
  const taxAmount = Math.round(roundedSubtotal * (taxRate / 100) * 100) / 100;
  const total = Math.round((roundedSubtotal + taxAmount) * 100) / 100;
  return { subtotal: roundedSubtotal, taxAmount, total };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'sent':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'paid':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'overdue':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];
