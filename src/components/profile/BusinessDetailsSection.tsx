interface BusinessDetailsSectionProps {
  businessName: string;
  setBusinessName: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  saving: boolean;
}

export const BusinessDetailsSection = ({
  businessName,
  setBusinessName,
  city,
  setCity,
  country,
  setCountry,
  saving,
}: BusinessDetailsSectionProps) => {
  return (
    <div>
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        Business Details
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="lg:col-span-2">
          <label
            htmlFor="business_name"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Business Name{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
              (Optional)
            </span>
          </label>
          <input
            id="business_name"
            type="text"
            disabled={saving}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Acme Studio"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            disabled={saving}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. London"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            disabled={saving}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. United Kingdom"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
