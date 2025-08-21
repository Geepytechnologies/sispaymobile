import { ISuccessResponse } from "../general.interface";

export interface IAccountDTO {
id: string; 
  balance: number;
  accountId: string;
  accountName: string;
  accountType: string;
  accountNumber: string;
  identityId: string;
  accountPin?: string; 
  accountPinSet: boolean;
  bvn?: string; 
  nin: string;
  kyc: boolean;
  tier: string;
}

export type IAccountResponse = {
  result: IAccountDTO;
} & ISuccessResponse;