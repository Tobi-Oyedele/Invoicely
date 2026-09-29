import { AuthField } from "../auth/AuthField";
import { ProfileSection } from "./ProfileSection";
import type { ProfileSectionProps } from "./types";

export const PersonalInfoSection = ({ values, set, saving }: ProfileSectionProps) => {
  return (
    <ProfileSection title="Your details">
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField
          label="First name"
          autoComplete="given-name"
          disabled={saving}
          value={values.firstName}
          onChange={(e) => set("firstName", e.target.value)}
        />
        <AuthField
          label="Last name"
          autoComplete="family-name"
          disabled={saving}
          value={values.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
      </div>
    </ProfileSection>
  );
};
