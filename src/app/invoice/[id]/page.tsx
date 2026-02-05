'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import InvoicePreview from '@/components/InvoicePreview';
import InvoicePDFButton from '@/components/InvoicePDF';
import { createClient } from '@/lib/supabase';
import { Invoice, InvoiceStatus } from '@/lib/types';

export default function InvoiceViewPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setInvoice(data as Invoice);

      // Check ownership
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && data.user_id === user.id) {
        setIsOwner(true);
      } else if (!user && data.anonymous_token) {
        const token = localStorage.getItem('simpleinvoice_anon_token');
        if (token === data.anonymous_token) {
          setIsOwner(true);
        }
      }
    }

    setLoading(false);
  };

  const handleStatusChange = async (status: InvoiceStatus) => {
    if (!invoice) return;

    const updates: Partial<Invoice> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'paid') {
      updates.paid_at = new Date().toISOString();
    } else {
      updates.paid_at = null;
    }

    const { error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoice.id);

    if (!error) {
      setInvoice({ ...invoice, ...updates });
    }
  };

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-600/30 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-white mb-2">Invoice not found</h1>
        <p className="text-sm text-gray-400 mb-6">
          This invoice doesn&apos;t exist or has been deleted.
        </p>
        <Link
          href="/"
          className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-white/10 text-sm text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
            {copied ? 'Copied!' : 'Share Link'}
          </button>
          <InvoicePDFButton invoice={invoice} />
        </div>
      </div>

      <InvoicePreview
        invoice={invoice}
        showActions={isOwner}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
