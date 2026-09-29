import { AuthField } from "../auth/AuthField";
import { Optional, ProfileSection } from "./ProfileSection";
import type { ProfileSectionProps } from "./types";

export const PayoutCredentialsSection = ({ values, set, saving }: ProfileSectionProps) => {
  return (
    <ProfileSection title="Payment details">
      <div className="grid gap-5 sm:grid-cols-3">
        <AuthField
          label="Bank name"
          autoComplete="off"
          disabled={saving}
          value={values.bankName}
          onChange={(e) => set("bankName", e.target.value)}
        />
        <AuthField
          label="Account number"
          autoComplete="off"
          inputMode="numeric"
          spellCheck={false}
          disabled={saving}
          value={values.accountNumber}
          onChange={(e) => set("accountNumber", e.target.value)}
          className="font-mono tabular-nums"
        />
        <AuthField
          label="Account holder name"
          autoComplete="off"
          disabled={saving}
          value={values.accountName}
          onChange={(e) => set("accountName", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <AuthField
          label="Account type"
          labelAside={<Optional />}
          placeholder="e.g. Checking"
          autoComplete="off"
          disabled={saving}
          value={values.accountType}
          onChange={(e) => set("accountType", e.target.value)}
        />
        <AuthField
          label="Routing / sort code"
          labelAside={<Optional />}
          autoComplete="off"
          spellCheck={false}
          disabled={saving}
          value={values.routingNumber}
          onChange={(e) => set("routingNumber", e.target.value)}
          className="font-mono tabular-nums"
        />
        <AuthField
          label="SWIFT / BIC"
          labelAside={<Optional />}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={saving}
          value={values.swiftCode}
          onChange={(e) => set("swiftCode", e.target.value.toUpperCase())}
          className="font-mono uppercase"
        />
      </div>

      <AuthField
        label="Bank branch address"
        labelAside={<Optional />}
        autoComplete="off"
        disabled={saving}
        value={values.bankAddress}
        onChange={(e) => set("bankAddress", e.target.value)}
      />
    </ProfileSection>
  );
};
