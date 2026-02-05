'use client';

// Client-side PDF generation using browser print / save as PDF
// We avoid @react-pdf/renderer to keep the bundle lean and avoid SSR issues.
// Instead we render a print-optimized HTML view and use window.print().

import { Invoice } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoicePDFProps {
  invoice: Invoice;
}

export function generatePDFHTML(invoice: Invoice): string {
  const itemsRows = invoice.items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151">${item.description}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#6b7280;text-align:right">${item.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#6b7280;text-align:right">${formatCurrency(item.rate, invoice.currency)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#374151;text-align:right;font-weight:500">${formatCurrency(item.quantity * item.rate, invoice.currency)}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; color: #111; }
    .page { max-width: 800px; margin: 0 auto; padding: 48px; }
    @media print { .page { padding: 24px; } }
  </style>
</head>
<body>
  <div class="page">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
      <div>
        <h1 style="font-size:28px;font-weight:700;color:#111">INVOICE</h1>
        <p style="font-size:14px;color:#9ca3af;font-family:monospace;margin-top:4px">${invoice.invoice_number}</p>
      </div>
      <div style="padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:capitalize;${
        invoice.status === 'paid'
          ? 'background:#ecfdf5;color:#047857;border:1px solid #a7f3d0'
          : invoice.status === 'overdue'
          ? 'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca'
          : 'background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb'
      }">
        ${invoice.status}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px">
      <div>
        <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">From</p>
        ${invoice.from_name ? `<p style="font-size:14px;font-weight:500;color:#111">${invoice.from_name}</p>` : ''}
        ${invoice.from_email ? `<p style="font-size:14px;color:#6b7280">${invoice.from_email}</p>` : ''}
      </div>
      <div>
        <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Bill To</p>
        <p style="font-size:14px;font-weight:500;color:#111">${invoice.client_name}</p>
        ${invoice.client_email ? `<p style="font-size:14px;color:#6b7280">${invoice.client_email}</p>` : ''}
      </div>
    </div>

    <div style="display:flex;gap:48px;margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #f0f0f0">
      <div>
        <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Date</p>
        <p style="font-size:14px;color:#374151">${formatDate(invoice.created_at)}</p>
      </div>
      <div>
        <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Due Date</p>
        <p style="font-size:14px;color:#374151">${formatDate(invoice.due_date)}</p>
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr style="border-bottom:2px solid #e5e7eb">
          <th style="text-align:left;padding:10px 8px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Description</th>
          <th style="text-align:right;padding:10px 8px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Qty</th>
          <th style="text-align:right;padding:10px 8px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Rate</th>
          <th style="text-align:right;padding:10px 8px;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div style="display:flex;justify-content:flex-end">
      <div style="width:240px">
        <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#6b7280">
          <span>Subtotal</span>
          <span>${formatCurrency(invoice.subtotal, invoice.currency)}</span>
        </div>
        ${
          invoice.tax_rate > 0
            ? `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#6b7280">
          <span>Tax (${invoice.tax_rate}%)</span>
          <span>${formatCurrency(invoice.tax_amount, invoice.currency)}</span>
        </div>`
            : ''
        }
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #111;font-size:18px;font-weight:700;color:#111">
          <span>Total</span>
          <span>${formatCurrency(invoice.total, invoice.currency)}</span>
        </div>
      </div>
    </div>

    ${
      invoice.notes
        ? `<div style="margin-top:40px;padding-top:24px;border-top:1px solid #f0f0f0">
      <p style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Notes</p>
      <p style="font-size:14px;color:#6b7280;white-space:pre-wrap">${invoice.notes}</p>
    </div>`
        : ''
    }

    <div style="margin-top:48px;text-align:center">
      <p style="font-size:12px;color:#d1d5db">Created with SimpleInvoice</p>
    </div>
  </div>
</body>
</html>`;
}

export function printInvoice(invoice: Invoice) {
  const html = generatePDFHTML(invoice);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

export default function InvoicePDFButton({ invoice }: InvoicePDFProps) {
  return (
    <button
      onClick={() => printInvoice(invoice)}
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
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      Download PDF
    </button>
  );
}
