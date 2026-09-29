import { FiDownload, FiUsers, FiGlobe, FiPercent } from "react-icons/fi";

const features = [
  {
    icon: FiDownload,
    title: "PDF in one click",
    body: "Your invoice is rendered in the browser as a vector PDF. Nothing is uploaded to generate it.",
  },
  {
    icon: FiPercent,
    title: "Totals that add up",
    body: "Quantity times rate, summed for you. Change a number and every total follows.",
  },
  {
    icon: FiGlobe,
    title: "NGN, USD, EUR, GBP, CAD",
    body: "Choose your currency once in your profile. Every new invoice uses it.",
  },
  {
    icon: FiUsers,
    title: "Clients saved once",
    body: "Store a client's details and pick them from a list next time. Payment details print on every invoice.",
  },
];

const Features = () => {
  return (
    <section id="features" className="border-t border-line py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 md:gap-16">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-fg md:sticky md:top-24">
            Only what an invoice needs
          </h2>
          <p className="mt-3 text-fg-muted leading-relaxed max-w-sm">
            No project boards, no time tracking, no upsell tiers. Invoices and
            the clients you send them to.
          </p>
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {features.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 py-6">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-line-strong text-fg-muted">
                <Icon className="size-4" />
              </span>
              <div>
                <h3 className="font-medium text-fg">{title}</h3>
                <p className="mt-1 text-sm text-fg-muted leading-relaxed max-w-lg">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;
