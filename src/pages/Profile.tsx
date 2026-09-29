import { useCallback, useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { PersonalInfoSection } from "../components/profile/PersonalInfoSection";
import { BusinessDetailsSection } from "../components/profile/BusinessDetailsSection";
import { PayoutCredentialsSection } from "../components/profile/PayoutCredentialsSection";
import { EMPTY_PROFILE, type ProfileValues } from "../components/profile/types";
import { InvoicingSection } from "../components/profile/InvoicingSection";
import { DEFAULT_CURRENCY } from "../lib/currency";
import { FiAlertCircle, FiCheck, FiLoader, FiRefreshCw } from "react-icons/fi";

const Profile = () => {
  // Form values, and the last values known to be stored, to detect unsaved edits
  const [values, setValues] = useState<ProfileValues>(EMPTY_PROFILE);
  const [savedValues, setSavedValues] = useState<ProfileValues>(EMPTY_PROFILE);

  // Read-only metadata
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // UI state
  const [fetching, setFetching] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const dirty = (Object.keys(values) as (keyof ProfileValues)[]).some(
    (key) => values[key] !== savedValues[key],
  );

  const set = (key: keyof ProfileValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setJustSaved(false);
  };

  useEffect(() => {
    document.title = "My Business Profile | Invoicely";
  }, []);

  // "Saved" confirmation fades after a few seconds; errors stay until acted on
  useEffect(() => {
    if (justSaved) {
      const timer = setTimeout(() => setJustSaved(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [justSaved]);

  // Warn before closing the tab with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const fetchUserProfile = useCallback(async () => {
    try {
      setFetching(true);
      setLoadError(null);

      // 1. Get logged-in user session (guaranteed by protected routes)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Your session has expired. Sign in again to edit your profile.");
      }

      setUserId(user.id);
      setEmail(user.email || "");

      // 2. Query profiles table by id
      const { data: profile, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (dbError) throw dbError;

      const loaded: ProfileValues = profile
        ? {
            firstName: profile.first_name || "",
            lastName: profile.last_name || "",
            businessName: profile.business_name || "",
            city: profile.city || "",
            country: profile.country || "",
            bankName: profile.bank_name || "",
            accountNumber: profile.account_number || "",
            accountName: profile.account_name || "",
            accountType: profile.account_type || "",
            routingNumber: profile.routing_number || "",
            swiftCode: profile.swift_code || "",
            bankAddress: profile.bank_address || "",
            currency: profile.default_currency || DEFAULT_CURRENCY,
          }
        : EMPTY_PROFILE;

      setValues(loaded);
      setSavedValues(loaded);
      // If the profile row doesn't exist yet, fall back to the auth account's creation date
      setCreatedAt(profile?.created_at || user.created_at || "");
    } catch (err) {
      const error = err as Error;
      console.error("Error loading profile:", error);
      // Never show an empty form after a failed load: saving it would erase stored details.
      setLoadError(error.message || "We couldn't load your profile.");
    } finally {
      setFetching(false);
    }
  }, []);

  // Load profile details on mount
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        fetchUserProfile();
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [fetchUserProfile]);

  // Save changes handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || !dirty) return;

    try {
      setSaving(true);
      setJustSaved(false);
      setErrorMsg(null);

      // Upsert profile in database
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: userId,
        first_name: values.firstName.trim() || null,
        last_name: values.lastName.trim() || null,
        email: email, // Read-only but kept stored
        business_name: values.businessName.trim() || null,
        city: values.city.trim() || null,
        country: values.country.trim() || null,
        bank_name: values.bankName.trim() || null,
        account_number: values.accountNumber.trim() || null,
        account_name: values.accountName.trim() || null,
        account_type: values.accountType.trim() || null,
        routing_number: values.routingNumber.trim() || null,
        swift_code: values.swiftCode.trim() || null,
        bank_address: values.bankAddress.trim() || null,
        default_currency: values.currency,
      });

      if (upsertError) throw upsertError;

      setSavedValues(values);
      setJustSaved(true);
    } catch (err) {
      const error = err as Error;
      console.error("Error saving profile:", error);
      setErrorMsg(error.message || "Your changes weren't saved. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <div className="mb-8">
      <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-fg">
        Profile
      </h1>
      <p className="mt-1.5 text-sm text-fg-muted">
        The details printed on your invoices, and where clients should pay you.
      </p>
    </div>
  );

  // Loading skeleton view
  if (fetching) {
    return (
      <main aria-busy="true" className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {header}
        <div className="space-y-8 motion-safe:animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="mb-5 h-4 w-28 rounded bg-line" />
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="h-10 rounded-md bg-line" />
                <div className="h-10 rounded-md bg-line" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto">
        {header}
        <div className="max-w-md border-t border-fg pt-5">
          <h2 className="font-medium text-fg">We couldn't load your profile</h2>
          <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{loadError}</p>
          <button
            type="button"
            onClick={fetchUserProfile}
            className="mt-5 inline-flex items-center gap-2 rounded-md border border-line-strong px-3.5 py-2 text-sm font-medium text-fg hover:border-fg-subtle hover:bg-surface transition-colors cursor-pointer"
          >
            <FiRefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-6 px-4 lg:pt-10 lg:px-8 max-w-4xl mx-auto text-fg selection:bg-line-strong">
      {header}

      <ProfileHeader
        firstName={values.firstName}
        lastName={values.lastName}
        createdAt={createdAt}
        email={email}
      />

      <form onSubmit={handleSubmit}>
        <div className="mt-8 space-y-8 pb-8">
          <PersonalInfoSection values={values} set={set} saving={saving} />
          <BusinessDetailsSection values={values} set={set} saving={saving} />
          <InvoicingSection values={values} set={set} saving={saving} />
          <PayoutCredentialsSection values={values} set={set} saving={saving} />
        </div>

        {/* Save bar: stays in reach at the bottom of a long form */}
        <div className="sticky bottom-0 -mx-4 lg:-mx-8 mt-2 flex flex-col-reverse gap-3 border-t border-line bg-canvas/85 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-end lg:px-8">
          <p aria-live="polite" className="min-h-5 text-sm sm:mr-auto">
            {errorMsg ? (
              <span role="alert" className="flex items-start gap-1.5 text-danger">
                <FiAlertCircle className="mt-0.5 size-4 shrink-0" />
                {errorMsg}
              </span>
            ) : justSaved ? (
              <span className="inline-flex items-center gap-1.5 text-accent">
                <FiCheck className="size-4" />
                Saved
              </span>
            ) : dirty ? (
              <span className="text-fg-muted">You have unsaved changes</span>
            ) : null}
          </p>
          <button
            type="submit"
            disabled={saving || !dirty}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-fg px-4 py-2.5 text-sm font-medium text-canvas transition hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg-muted sm:w-auto"
          >
            {saving && <FiLoader className="size-4 animate-spin" />}
            {saving ? "Saving" : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default Profile;
