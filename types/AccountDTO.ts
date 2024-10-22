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
  IdentityType: string;
  Phone: string;
  Email: string;
  IdentityNumber: string;
  IdentityId: string;
  Otp: string;
}
