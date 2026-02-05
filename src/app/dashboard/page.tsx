'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Invoice, InvoiceStatus } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor, getOrCreateAnonToken } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);

    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false });

    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      const token = getOrCreateAnonToken();
      query = query.eq('anonymous_token', token);
    }

    const { data } = await query;
    setInvoices((data as Invoice[]) || []);
    setLoading(false);
  };

  const filtered =
    filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter);

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === 'draft').length,
    sent: invoices.filter((i) => i.status === 'sent').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    totalOutstanding: invoices
      .filter((i) => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + Number(i.total), 0),
    totalPaid: invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total), 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            {user ? 'Your invoices' : 'Your anonymous invoices'}
          </p>
        </div>
        <Link
          href="/create"
          className="px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-xl hover:bg-brand-500 transition-colors shadow-lg shadow-brand-600/20"
        >
          + New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
          <p className="text-xs text-gray-500 mb-1">Total Outstanding</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(stats.totalOutstanding)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
          <p className="text-xs text-gray-500 mb-1">Total Paid</p>
          <p className="text-xl font-bold text-emerald-400">
            {formatCurrency(stats.totalPaid)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
          <p className="text-xs text-gray-500 mb-1">Invoices</p>
          <p className="text-xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/40 border border-white/5">
          <p className="text-xs text-gray-500 mb-1">Overdue</p>
          <p className="text-xl font-bold text-red-400">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                : 'text-gray-500 border border-white/5 hover:text-gray-300 hover:border-white/10'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-1.5 text-gray-600">
                {stats[status as InvoiceStatus]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-brand-600/30 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gray-900/50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">No invoices yet</p>
          <Link
            href="/create"
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            Create your first invoice →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/invoice/${invoice.id}`}
              className="block p-4 rounded-xl bg-gray-900/30 border border-white/5 hover:border-white/10 hover:bg-gray-900/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-gray-500">
                        {invoice.invoice_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate">
                      {invoice.client_name}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(Number(invoice.total), invoice.currency)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatDate(invoice.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Sign up prompt for anonymous users */}
      {!user && invoices.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl bg-brand-600/5 border border-brand-600/20 text-center">
          <p className="text-sm text-gray-400 mb-3">
            Sign up to keep your invoices forever and unlock unlimited invoicing.
          </p>
          <Link
            href="/auth"
            className="text-sm text-brand-400 font-medium hover:text-brand-300 transition-colors"
          >
            Create free account →
          </Link>
        </div>
      )}
    </div>
  );
}
