import { AuthField } from "../auth/AuthField";
import { Optional, ProfileSection } from "./ProfileSection";
import type { ProfileSectionProps } from "./types";

export const BusinessDetailsSection = ({ values, set, saving }: ProfileSectionProps) => {
  return (
    <ProfileSection title="Business">
      <AuthField
        label="Business name"
        labelAside={<Optional />}
        autoComplete="organization"
        placeholder="e.g. Acme Studio"
        disabled={saving}
        value={values.businessName}
        onChange={(e) => set("businessName", e.target.value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField
          label="City"
          autoComplete="address-level2"
          disabled={saving}
          value={values.city}
          onChange={(e) => set("city", e.target.value)}
        />
        <AuthField
          label="Country"
          autoComplete="country-name"
          disabled={saving}
          value={values.country}
          onChange={(e) => set("country", e.target.value)}
        />
      </div>
    </ProfileSection>
  );
};
