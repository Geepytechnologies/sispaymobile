export interface AccountDTO {
  id: string;
  balance: number;
  accountId: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
  identityId: string;
  accountPin: string | null;
  accountPinSet: boolean;
  bvn: string;
  nin: string;
  kyc: boolean;
  tier: string;
}

export interface VerifyAndCreateAccountDTO {
  IdentityType: string | string[];
  Phone: string | undefined;
  Email: string | undefined;
  IdentityNumber: string | string[];
  IdentityId: string | string[];
  Otp: string;
}
