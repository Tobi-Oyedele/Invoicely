import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const steps = [
  {
    title: "Enter details",
    body: "Your business, your client, and where to pay you.",
  },
  {
    title: "Add items",
    body: "Description, quantity and rate. Totals are calculated as you type.",
  },
  {
    title: "Download PDF",
    body: "Check the layout, then download a file ready to send.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="border-t border-line py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-fg max-w-md">
          Blank page to sent invoice in under a minute
        </h2>

        <ol className="mt-12 grid md:grid-cols-3 gap-x-10 gap-y-8">
          {steps.map((s) => (
            <li key={s.title} className="border-t border-fg pt-4">
              <h3 className="font-medium text-fg">{s.title}</h3>
              <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>

        <Link
          to="/sign-up"
          className="group mt-12 inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-fg-muted transition-colors"
        >
          Start with a free account
          <FiArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
