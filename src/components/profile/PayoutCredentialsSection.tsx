interface PayoutCredentialsSectionProps {
  bankName: string;
  setBankName: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  accountName: string;
  setAccountName: (val: string) => void;
  accountType: string;
  setAccountType: (val: string) => void;
  routingNumber: string;
  setRoutingNumber: (val: string) => void;
  swiftCode: string;
  setSwiftCode: (val: string) => void;
  bankAddress: string;
  setBankAddress: (val: string) => void;
  saving: boolean;
}

export const PayoutCredentialsSection = ({
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  accountName,
  setAccountName,
  accountType,
  setAccountType,
  routingNumber,
  setRoutingNumber,
  swiftCode,
  setSwiftCode,
  bankAddress,
  setBankAddress,
  saving,
}: PayoutCredentialsSectionProps) => {
  return (
    <div>
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        Payout Credentials
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Row 1 */}
        <div>
          <label
            htmlFor="bank_name"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Bank Name
          </label>
          <input
            id="bank_name"
            type="text"
            disabled={saving}
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g. Barclays"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="account_number"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Account Number
          </label>
          <input
            id="account_number"
            type="text"
            disabled={saving}
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g. 12345678"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="account_name"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Account Holder Name
          </label>
          <input
            id="account_name"
            type="text"
            disabled={saving}
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="e.g. Jane Doe"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        {/* Row 2 */}
        <div>
          <label
            htmlFor="account_type"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Account Type{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
              (Optional)
            </span>
          </label>
          <input
            id="account_type"
            type="text"
            disabled={saving}
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            placeholder="e.g. Checking, Savings"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="routing_number"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Routing / Sort Code{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
              (Optional)
            </span>
          </label>
          <input
            id="routing_number"
            type="text"
            disabled={saving}
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            placeholder="e.g. 12-34-56"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label
            htmlFor="swift_code"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            SWIFT / BIC Code{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
              (Optional)
            </span>
          </label>
          <input
            id="swift_code"
            type="text"
            disabled={saving}
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            placeholder="e.g. BARCGB22"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>

        {/* Row 3 */}
        <div className="lg:col-span-3">
          <label
            htmlFor="bank_address"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
          >
            Bank Branch Address{" "}
            <span className="text-zinc-400 dark:text-zinc-500 font-normal normal-case italic">
              (Optional)
            </span>
          </label>
          <input
            id="bank_address"
            type="text"
            disabled={saving}
            value={bankAddress}
            onChange={(e) => setBankAddress(e.target.value)}
            placeholder="e.g. 1 Churchill Place, London E14 5HP"
            className="block w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-lg placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};
