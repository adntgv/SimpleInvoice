'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvoiceFormData, LineItem } from '@/lib/types';
import {
  createEmptyLineItem,
  calculateTotals,
  formatCurrency,
  CURRENCIES,
  generateInvoiceNumber,
} from '@/lib/utils';

interface InvoiceFormProps {
  onSubmit: (data: InvoiceFormData, invoiceNumber: string) => void;
  loading?: boolean;
  initial?: Partial<InvoiceFormData>;
}

export default function InvoiceForm({ onSubmit, loading, initial }: InvoiceFormProps) {
  const [clientName, setClientName] = useState(initial?.client_name || '');
  const [clientEmail, setClientEmail] = useState(initial?.client_email || '');
  const [fromName, setFromName] = useState(initial?.from_name || '');
  const [fromEmail, setFromEmail] = useState(initial?.from_email || '');
  const [items, setItems] = useState<LineItem[]>(
    initial?.items || [createEmptyLineItem()]
  );
  const [taxRate, setTaxRate] = useState(initial?.tax_rate || 0);
  const [currency, setCurrency] = useState(initial?.currency || 'USD');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [dueDate, setDueDate] = useState(initial?.due_date || '');
  const [invoiceNumber] = useState(generateInvoiceNumber());

  const totals = calculateTotals(items, taxRate);

  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value };
          updated.amount =
            Math.round(updated.quantity * updated.rate * 100) / 100;
          return updated;
        })
      );
    },
    []
  );

  const addItem = () => setItems((prev) => [...prev, createEmptyLineItem()]);

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        client_name: clientName,
        client_email: clientEmail,
        from_name: fromName,
        from_email: fromEmail,
        items,
        tax_rate: taxRate,
        currency,
        notes,
        due_date: dueDate,
      },
      invoiceNumber
    );
  };

  const inputClass =
    'w-full bg-gray-900/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-600/50 focus:border-brand-600/50 transition-all';
  const labelClass = 'block text-xs font-medium text-gray-400 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Invoice Number */}
      <div className="flex items-center gap-3 p-4 bg-gray-900/30 rounded-xl border border-white/5">
        <span className="text-sm text-gray-500">Invoice #</span>
        <span className="text-sm font-mono font-medium text-white">
          {invoiceNumber}
        </span>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            From
          </h3>
          <div>
            <label className={labelClass}>Your Name / Business</label>
            <input
              className={inputClass}
              placeholder="Acme Inc."
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Your Email</label>
            <input
              className={inputClass}
              type="email"
              placeholder="you@example.com"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Bill To
          </h3>
          <div>
            <label className={labelClass}>Client Name *</label>
            <input
              className={inputClass}
              placeholder="Client name"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Client Email</label>
            <input
              className={inputClass}
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">Line Items</h3>
        <div className="hidden md:grid grid-cols-12 gap-2 px-1 text-xs text-gray-500 font-medium">
          <div className="col-span-5">Description</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1" />
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-900/30 rounded-xl border border-white/5"
          >
            <div className="col-span-12 md:col-span-5">
              <input
                className={inputClass}
                placeholder="Description"
                required
                value={item.description}
                onChange={(e) =>
                  updateItem(item.id, 'description', e.target.value)
                }
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                className={`${inputClass} text-right`}
                type="number"
                min="0"
                step="1"
                required
                value={item.quantity || ''}
                onChange={(e) =>
                  updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <input
                className={`${inputClass} text-right`}
                type="number"
                min="0"
                step="0.01"
                required
                value={item.rate || ''}
                onChange={(e) =>
                  updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="col-span-3 md:col-span-2 text-right text-sm font-medium text-white pr-1">
              {formatCurrency(item.quantity * item.rate, currency)}
            </div>
            <div className="col-span-1 flex justify-center">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-1 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30"
                disabled={items.length <= 1}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/10 text-sm text-gray-500 hover:text-brand-400 hover:border-brand-500/30 transition-all"
        >
          + Add line item
        </button>
      </div>

      {/* Settings Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Currency</label>
          <select
            className={inputClass}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tax Rate (%)</label>
          <input
            className={`${inputClass} text-right`}
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={taxRate || ''}
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className={labelClass}>Due Date</label>
          <input
            className={inputClass}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="Payment terms, bank details, thank you note..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:w-72 space-y-2 p-4 bg-gray-900/50 rounded-xl border border-white/5">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal, currency)}</span>
          </div>
          {taxRate > 0 && (
            <div className="flex justify-between text-sm text-gray-400">
              <span>Tax ({taxRate}%)</span>
              <span>{formatCurrency(totals.taxAmount, currency)}</span>
            </div>
          )}
          <div className="border-t border-white/10 pt-2 flex justify-between text-base font-semibold text-white">
            <span>Total</span>
            <span>{formatCurrency(totals.total, currency)}</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/20"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            'Create Invoice'
          )}
        </button>
      </div>
    </form>
  );
}
