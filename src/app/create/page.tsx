'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/InvoiceForm';
import { InvoiceFormData } from '@/lib/types';
import { createClient } from '@/lib/supabase';
import {
  getOrCreateAnonToken,
  canCreateInvoice,
  getRemainingFreeInvoices,
  incrementAnonCount,
  calculateTotals,
} from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [remaining, setRemaining] = useState(3);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setRemaining(user ? Infinity : getRemainingFreeInvoices());
    });
  }, []);

  const handleSubmit = async (data: InvoiceFormData, invoiceNumber: string) => {
    const isAuth = !!user;
    if (!canCreateInvoice(isAuth)) {
      setError('You\'ve used all 3 free invoices. Sign up to create more!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totals = calculateTotals(data.items, data.tax_rate);
      const anonToken = isAuth ? null : getOrCreateAnonToken();

      const { data: invoice, error: dbError } = await supabase
        .from('invoices')
        .insert({
          user_id: user?.id || null,
          anonymous_token: anonToken,
          invoice_number: invoiceNumber,
          status: 'draft',
          client_name: data.client_name,
          client_email: data.client_email || null,
          from_name: data.from_name || null,
          from_email: data.from_email || null,
          items: data.items,
          subtotal: totals.subtotal,
          tax_rate: data.tax_rate,
          tax_amount: totals.taxAmount,
          total: totals.total,
          currency: data.currency,
          notes: data.notes || null,
          due_date: data.due_date || null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      if (!isAuth) {
        incrementAnonCount();
        setRemaining(getRemainingFreeInvoices());
      }

      router.push(`/invoice/${invoice.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Invoice</h1>
        <div className="flex items-center gap-3 mt-2">
          <p className="text-sm text-gray-400">
            Fill in the details below to generate a professional invoice.
          </p>
          {!user && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-brand-600/10 text-brand-400 border border-brand-600/20">
              {remaining} free left
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <InvoiceForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
