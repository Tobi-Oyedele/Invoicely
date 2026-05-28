const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 border-t border-zinc-100 dark:border-zinc-900 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Get from blank page to finished invoice in less than a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Step 1 */}
          <div className="flex flex-col items-start">
            <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 select-none">
              01
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Enter Details
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              Enter your business details, client information, and payment
              details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start">
            <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50  mb-4 select-none">
              02
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Add Items
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              Add line items with descriptions, quantities, and rates. The
              system does all the math instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start">
            <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mb-4 select-none">
              03
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Download PDF
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              Preview your completed layout and download a polished PDF invoice
              to send directly to your client.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
