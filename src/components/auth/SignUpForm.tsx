import { useState, type FormEvent } from "react";
import { AuthField } from "./AuthField";
import { SubmitButton } from "./SubmitButton";
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from "../../lib/authValidation";

interface SignUpFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
}

type FieldName = "firstName" | "lastName" | "email" | "password";

export const SignUpForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: SignUpFormProps) => {
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  const errors: Record<FieldName, string | null> = {
    firstName: validateRequired("first name")(firstName),
    lastName: validateRequired("last name")(lastName),
    email: validateEmail(email),
    password: validatePassword(password),
  };
  const shown = (f: FieldName) => (touched[f] ? errors[f] : null);
  const touch = (f: FieldName) => () => setTouched((t) => ({ ...t, [f]: true }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setTouched({ firstName: true, lastName: true, email: true, password: true });
      return;
    }
    onSubmit(e);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-3">
        <AuthField
          label="First name"
          name="firstName"
          autoComplete="given-name"
          disabled={loading}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          onBlur={touch("firstName")}
          error={shown("firstName")}
        />
        <AuthField
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          disabled={loading}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onBlur={touch("lastName")}
          error={shown("lastName")}
        />
      </div>
      <AuthField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        disabled={loading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={touch("email")}
        error={shown("email")}
        placeholder="you@studio.com"
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        disabled={loading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={touch("password")}
        error={shown("password")}
        placeholder="At least 6 characters"
      />
      <div className="pt-2">
        <SubmitButton loading={loading} loadingLabel="Creating account">
          Create account
        </SubmitButton>
      </div>
    </form>
  );
};
