import {
  IVerifyCableTvResponse,
  IVerifyPowerResponse,
} from "./responses/billpayment.interface";

export type IErrors = {
  attemptedValue: string | null;
  customState: string | null;
  errorCode: string;
  errorMessage: string;
  propertyName: string;
  severity: number;
  formattedMessagePlaceholderValues: {
    PropertyName: string;
    PropertyPath: string;
    PropertyValue: string | null;
  };
};

export type ISuccessResponse = {
  error: IErrors[] | null | undefined;
  statusCode: number;
  message: string;
};

export interface ApiRequestProps {
  onSuccess?: (_val: ISuccessResponse) => void;
  onReset?: () => void;
  onError?: (message: string) => void;
}
