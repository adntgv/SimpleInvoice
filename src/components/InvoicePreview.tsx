'use client';

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface InvoicePreviewProps {
  invoice: Invoice;
  showActions?: boolean;
  onStatusChange?: (status: Invoice['status']) => void;
}

export default function InvoicePreview({
  invoice,
  showActions = false,
  onStatusChange,
}: InvoicePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Status Bar */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-900/30 rounded-xl border border-white/5">
          <span className="text-sm text-gray-400 mr-2">Status:</span>
          {(['draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange?.(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all ${
                invoice.status === status
                  ? getStatusColor(status)
                  : 'border-white/5 text-gray-600 hover:text-gray-400 hover:border-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Invoice Paper */}
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-sm text-gray-500 font-mono mt-1">
                {invoice.invoice_number}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                invoice.status === 'paid'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : invoice.status === 'overdue'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : invoice.status === 'sent'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              {invoice.status}
            </div>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                From
              </p>
              {invoice.from_name && (
                <p className="text-sm font-medium text-gray-900">
                  {invoice.from_name}
                </p>
              )}
              {invoice.from_email && (
                <p className="text-sm text-gray-500">{invoice.from_email}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Bill To
              </p>
              <p className="text-sm font-medium text-gray-900">
                {invoice.client_name}
              </p>
              {invoice.client_email && (
                <p className="text-sm text-gray-500">{invoice.client_email}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 pb-6 border-b border-gray-100">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-sm text-gray-700">
                {formatDate(invoice.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Due Date
              </p>
              <p className="text-sm text-gray-700">
                {formatDate(invoice.due_date)}
              </p>
            </div>
            {invoice.paid_at && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Paid On
                </p>
                <p className="text-sm text-gray-700">
                  {formatDate(invoice.paid_at)}
                </p>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Qty
                </th>
                <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rate
                </th>
                <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 text-sm text-gray-700">
                    {item.description}
                  </td>
                  <td className="py-3 text-sm text-gray-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-sm text-gray-500 text-right">
                    {formatCurrency(item.rate, invoice.currency)}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-700 text-right">
                    {formatCurrency(item.quantity * item.rate, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax ({invoice.tax_rate}%)</span>
                  <span>
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-900 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Notes
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 sm:px-12 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Created with SimpleInvoice — Free invoicing for freelancers
          </p>
        </div>
      </div>
    </div>
  );
}
