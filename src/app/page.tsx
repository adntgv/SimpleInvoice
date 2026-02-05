import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-600/20 text-brand-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          3 free invoices — no signup needed
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
          Invoice your clients
          <br />
          <span className="text-brand-400">in seconds</span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Create professional invoices, share them with a link, track payment
          status. Built for freelancers who want to get paid, not manage
          software.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="px-8 py-3.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20 text-base"
          >
            Create your first invoice →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 border border-white/10 text-gray-400 font-medium rounded-xl hover:text-white hover:border-white/20 transition-all text-base"
          >
            View dashboard
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              ),
              title: 'Create in Seconds',
              desc: 'Clean invoice builder. Add line items, tax, notes, and due date. Done in under a minute.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>
              ),
              title: 'Share Instantly',
              desc: 'Each invoice gets a unique link. Send it via email, WhatsApp, or any messenger.',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              ),
              title: 'Track Payments',
              desc: 'Dashboard shows all invoices. Filter by draft, sent, paid, or overdue at a glance.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gray-900/40 border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          Simple pricing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-gray-900/40 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
            <p className="text-3xl font-bold text-white mb-4">
              $0<span className="text-sm font-normal text-gray-500">/forever</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> 3 invoices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> PDF download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Shareable links
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> No signup required
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-brand-600/10 border border-brand-600/30 relative">
            <div className="absolute -top-3 right-6 px-2 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
              Popular
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
            <p className="text-3xl font-bold text-white mb-4">
              $9<span className="text-sm font-normal text-gray-500">/month</span>
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-brand-400">✓</span> Unlimited invoices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-400">✓</span> Remove branding
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-400">✓</span> Recurring invoices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-400">✓</span> Priority support
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ready to get paid?
        </h2>
        <p className="text-gray-400 mb-8">
          Create your first invoice now. No credit card, no signup.
        </p>
        <Link
          href="/create"
          className="inline-flex px-8 py-3.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/20"
        >
          Start invoicing →
        </Link>
      </section>
    </div>
  );
}
