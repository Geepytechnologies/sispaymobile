export interface ValidatePinProps {
  onSuccess?: (message: string) => void;
  onReset?: () => void;
  onError?: (message: string) => void;
}
