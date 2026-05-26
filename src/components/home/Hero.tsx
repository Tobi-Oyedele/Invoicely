import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1] max-w-4xl mx-auto">
          Creating professional invoices has never been easier
        </h1>
        <p className="mt-6 text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Generate, download, and manage invoices in minutes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/sign-up"
            className="w-full sm:w-auto inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 text-white dark:text-zinc-950 font-medium px-6 py-3 rounded-lg transition-colors shadow-xs"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
