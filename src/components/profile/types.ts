export interface ProfileValues {
  firstName: string;
  lastName: string;
  businessName: string;
  city: string;
  country: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  routingNumber: string;
  swiftCode: string;
  bankAddress: string;
  currency: string;
}

export const EMPTY_PROFILE: ProfileValues = {
  firstName: "",
  lastName: "",
  businessName: "",
  city: "",
  country: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  accountType: "",
  routingNumber: "",
  swiftCode: "",
  bankAddress: "",
  currency: "NGN",
};

export interface ProfileSectionProps {
  values: ProfileValues;
  set: (key: keyof ProfileValues, value: string) => void;
  saving: boolean;
}
