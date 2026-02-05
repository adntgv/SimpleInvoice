export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  user_id: string | null;
  anonymous_token: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  client_name: string;
  client_email: string | null;
  from_name: string | null;
  from_email: string | null;
  items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  notes: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceFormData {
  client_name: string;
  client_email: string;
  from_name: string;
  from_email: string;
  items: LineItem[];
  tax_rate: number;
  currency: string;
  notes: string;
  due_date: string;
}

export interface DashboardStats {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  totalOutstanding: number;
  totalPaid: number;
}
