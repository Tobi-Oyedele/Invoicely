import axios from "axios";
import { http } from "./http";
import { errorResponseSchema, meResponseSchema } from "./schema";
import type { AuthUser } from "./schema";
import type { ProfileValues } from "../components/profile/types";

export function profileToForm(user: AuthUser): ProfileValues {
  const bank = user.paymentDetails;
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    businessName: user.businessName ?? "",
    city: user.city ?? "",
    country: user.country ?? "",
    currency: user.currency,
    bankName: bank?.bankName ?? "",
    accountNumber: bank?.accountNumber ?? "",
    accountName: bank?.accountHolderName ?? "",
    accountType: bank?.accountType ?? "",
    routingNumber: bank?.routingSortCode ?? "",
    swiftCode: bank?.swiftBicCode ?? "",
    bankAddress: bank?.bankBranchAddress ?? "",
  };
}

export async function saveProfile(values: ProfileValues): Promise<AuthUser> {
  const paymentDetails = {
    bankName: values.bankName.trim(),
    accountNumber: values.accountNumber.trim(),
    accountHolderName: values.accountName.trim(),
    accountType: values.accountType.trim(),
    routingSortCode: values.routingNumber.trim(),
    swiftBicCode: values.swiftCode.trim(),
    bankBranchAddress: values.bankAddress.trim(),
  };
  const hasBankDetails = Object.values(paymentDetails).some(value => value !== "");
  if (hasBankDetails && (!paymentDetails.bankName || !paymentDetails.accountNumber || !paymentDetails.accountHolderName)) {
    throw new Error("Enter bank name, account number, and account holder name, or clear all payment details.");
  }

  try {
    // Identity and email are deliberately excluded; the cookie identifies the user.
    const response = await http.patch<unknown>("/auth/me", {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      businessName: values.businessName.trim(),
      city: values.city.trim(),
      country: values.country.trim(),
      currency: values.currency,
      paymentDetails: hasBankDetails ? paymentDetails : null,
    });
    const result = meResponseSchema.safeParse(response.data);
    if (!result.success) throw new Error("The server returned an unexpected profile response.");
    return result.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<unknown>(error)) {
      const result = errorResponseSchema.safeParse(error.response?.data);
      throw new Error(result.success ? result.data.message : "Unable to save your profile. Please try again.", { cause: error });
    }
    throw error;
  }
}
