import {
  IVerifyCableTvResponse,
  IVerifyPowerResponse,
} from "./responses/billpayment.interface";

export type GetProductCategoriesParams = {
  id?: string;
};
export type getNotificationsParams = {
  pageNumber?: number;
  pageSize?: number;
  sortOrder?: "ascending" | "descending";
  status?: "Read" | "Unread" | "Dismissed";
  type?: "Transaction" | "Activity";
  startDate?: string;
  endDate?: string;
};
export interface VerifyCableTvProps {
  onSuccess?: (_val: IVerifyCableTvResponse) => void;
  onReset?: () => void;
  onError?: (message: string) => void;
}
export interface VerifyUtilityProps {
  onSuccess?: (_val: IVerifyPowerResponse) => void;
  onReset?: () => void;
  onError?: (message: string) => void;
}
