import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import HeroPreview from "./HeroPreview";

const Hero = () => {
  return (
    <section className="pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-[3.5rem] font-semibold tracking-[-0.035em] leading-[1.05] text-fg">
            Write the invoice. Download the PDF.
          </h1>
          <p className="mt-5 text-base md:text-lg text-fg-muted leading-relaxed max-w-xl">
            Add line items, pick a currency, and get a clean PDF you can send
            today. Free for freelancers, with no templates to fight.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 bg-fg text-canvas font-medium text-sm px-4 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition"
            >
              Create your first invoice
              <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/sign-in"
              className="text-sm font-medium text-fg-muted hover:text-fg px-3 py-2.5 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
};

export default Hero;
