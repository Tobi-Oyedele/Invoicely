import { SelectField } from "../ui/SelectField";
import { CURRENCIES } from "../../lib/currency";
import { ProfileSection } from "./ProfileSection";
import type { ProfileSectionProps } from "./types";

export const InvoicingSection = ({ values, set, saving }: ProfileSectionProps) => {
  return (
    <ProfileSection title="Invoicing">
      <div className="sm:max-w-xs">
        <SelectField
          label="Currency"
          disabled={saving}
          value={values.currency}
          onChange={(e) => set("currency", e.target.value)}
          className="font-mono"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol})
            </option>
          ))}
        </SelectField>
      </div>
    </ProfileSection>
  );
};
