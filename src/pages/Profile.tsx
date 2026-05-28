import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { PersonalInfoSection } from "../components/profile/PersonalInfoSection";
import { BusinessDetailsSection } from "../components/profile/BusinessDetailsSection";
import { PayoutCredentialsSection } from "../components/profile/PayoutCredentialsSection";
import { NotificationBanner } from "../components/profile/NotificationBanner";
import { FiLoader } from "react-icons/fi";

const Profile = () => {
  // Form state fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // International bank fields
  const [accountType, setAccountType] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankAddress, setBankAddress] = useState("");

  // Read-only metadata
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // UI state
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  // Load profile details on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetching(true);
        setErrorMsg(null);

        // 1. Get logged-in user session (guaranteed by protected routes)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error("Could not retrieve active session.");
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

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setProfession(profile.profession || "");
          setBusinessName(profile.business_name || "");
          setCity(profile.city || "");
          setCountry(profile.country || "");
          setBankName(profile.bank_name || "");
          setAccountNumber(profile.account_number || "");
          setAccountName(profile.account_name || "");
          setAccountType(profile.account_type || "");
          setRoutingNumber(profile.routing_number || "");
          setSwiftCode(profile.swift_code || "");
          setBankAddress(profile.bank_address || "");
          setCreatedAt(profile.created_at || user.created_at || "");
        } else {
          // If profile row doesn't exist yet, we initialize registration date from auth user metadata
          setCreatedAt(user.created_at || "");
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setErrorMsg(err?.message || "Failed to load profile settings.");
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Save changes handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      // Upsert profile in database
      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: userId,
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        email: email, // Read-only but kept stored
        profession: profession.trim() || null,
        business_name: businessName.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        bank_name: bankName.trim() || null,
        account_number: accountNumber.trim() || null,
        account_name: accountName.trim() || null,
        account_type: accountType || null,
        routing_number: routingNumber.trim() || null,
        swift_code: swiftCode.trim() || null,
        bank_address: bankAddress.trim() || null,
      });

      if (upsertError) throw upsertError;

      setSuccessMsg("Changes saved successfully.");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setErrorMsg(err?.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Loading skeleton view
  if (fetching) {
    return (
      <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto animate-pulse">
        <div className="mb-8">
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-4 w-72 bg-zinc-200 dark:bg-zinc-800 rounded-md mt-2"></div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 lg:p-8 space-y-6">
          <div className="h-28 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900/50"></div>
          <div className="space-y-4">
            <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-10 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
              <div className="h-10 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
            </div>
            <div className="h-10 bg-zinc-100 dark:bg-zinc-950 rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-6 px-4 lg:py-10 lg:px-8 max-w-4xl mx-auto selection:bg-zinc-100 dark:selection:bg-zinc-800 transition-all">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="mt-1 lg:mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your personal details and business credentials.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs p-6 lg:p-8 transition-colors">
        {/* Profile identity summary block */}
        <ProfileHeader
          firstName={firstName}
          lastName={lastName}
          profession={profession}
          createdAt={createdAt}
          email={email}
        />

        {/* Notifications */}
        <NotificationBanner successMsg={successMsg} errorMsg={errorMsg} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <PersonalInfoSection
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            profession={profession}
            setProfession={setProfession}
            saving={saving}
          />

          {/* Section 2: Business details */}
          <BusinessDetailsSection
            businessName={businessName}
            setBusinessName={setBusinessName}
            city={city}
            setCity={setCity}
            country={country}
            setCountry={setCountry}
            saving={saving}
          />

          {/* Section 3: Payout Details */}
          <PayoutCredentialsSection
            bankName={bankName}
            setBankName={setBankName}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            accountName={accountName}
            setAccountName={setAccountName}
            accountType={accountType}
            setAccountType={setAccountType}
            routingNumber={routingNumber}
            setRoutingNumber={setRoutingNumber}
            swiftCode={swiftCode}
            setSwiftCode={setSwiftCode}
            bankAddress={bankAddress}
            setBankAddress={setBankAddress}
            saving={saving}
          />

          {/* Form Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:active:bg-zinc-300 dark:text-zinc-950 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
            >
              {saving ? (
                <>
                  <FiLoader className="animate-spin -ml-1 mr-3 h-4 w-4 text-white dark:text-zinc-950" />
                  Saving changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Profile;
