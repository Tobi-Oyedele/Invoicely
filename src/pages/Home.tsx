import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-zinc-100">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main>
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1] max-w-4xl mx-auto">
              Creating professional invoices has never been easier
            </h1>
            <p className="mt-6 text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              Generate, download, and manage invoices in minutes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-xs"
              >
                Get Started for Free
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-white hover:bg-zinc-50 text-zinc-900 font-medium px-6 py-3 rounded-lg border border-zinc-200 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 md:py-28 border-t border-zinc-100 bg-zinc-50/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Features built for modern businesses
              </h2>
              <p className="mt-4 text-zinc-500">
                Everything you need to bill your clients, with none of the
                complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col items-start shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100 mb-6">
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
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  One-Click PDF
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Download instantly. Create and export clean, high-resolution
                  PDF invoices that represent your brand perfectly with a single
                  click.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-2xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col items-start shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-900 border border-zinc-100 mb-6">
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
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  Automated Math
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Auto-calculates subtotals and totals. Focus on listing your
                  items and quantities, and let our system automatically compute
                  taxes, discounts, and totals without errors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 md:py-28 border-t border-zinc-100"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-zinc-500">
                Get from blank page to finished invoice in less than a minute.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
              {/* Step 1 */}
              <div className="flex flex-col items-start">
                <div className="text-4xl font-extrabold text-zinc-200 mb-4 select-none">
                  01
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Enter Details
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Add your business info, client details, and custom terms in
                  intuitive, clean fields.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-start">
                <div className="text-4xl font-extrabold text-zinc-200 mb-4 select-none">
                  02
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Add Items
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Add line items with descriptions, quantities, and rates. The
                  system does all the math instantly.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-start">
                <div className="text-4xl font-extrabold text-zinc-200 mb-4 select-none">
                  03
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">
                  Download PDF
                </h3>
                <p className="text-zinc-500 leading-relaxed text-sm">
                  Preview your completed layout and download a polished PDF
                  invoice to send directly to your client.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
