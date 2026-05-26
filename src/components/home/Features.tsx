const Features = () => {
  return (
    <section
      id="features"
      className="py-20 md:py-28 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Features built for modern businesses
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Everything you need to bill your clients, with none of the
            complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col items-start shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/80 mb-6">
              {/* Download Icon SVG */}
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              One-Click PDF
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Download instantly. Create and export clean, high-resolution PDF
              invoices that represent your brand perfectly with a single click.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col items-start shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/80 mb-6">
              {/* Calculator/Math Icon SVG */}
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75V18m-3-3.675 3-3m0 0 3 3m-3-3v11.25m0-18a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h1.5v2.25a.75.75 0 0 0 1.5 0v-2.25H13.5a.75.75 0 0 0 0-1.5H12V3.75"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Automated Math
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Auto-calculates subtotals and totals. Focus on listing your items
              and quantities, and let our system automatically compute taxes,
              discounts, and totals without errors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
