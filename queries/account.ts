import { useMutation, useQuery } from "@tanstack/react-query";
import accountService from "@/services/account.service";
import { useUserStore } from "@/config/store";
import { ValidatePinProps } from "@/interfaces/dtos/account.dto.interface";
import handleAPIError from "@/utils/apiErrorMessage";

export const useUserAccount = () => {
  const { user } = useUserStore();
  const isEnabled = !!user?.accessToken;
  return useQuery({
    queryKey: ["getUserAccount"],
    queryFn: () => accountService.getUserAccount(),
    enabled: isEnabled,
  });
};
export const useValidateAccountPin = (props: ValidatePinProps) => {
  const { onSuccess, onError, onReset } = props;

  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (accountPin: string) => accountService.ValidatePin(accountPin),
    onSuccess: (values) => {
      onReset?.();
      onSuccess?.(values.message);
    },
    onError: (error: unknown) => {
      rest.reset();
      const errorMessage = handleAPIError(error);
      onError?.(errorMessage);
    },
  });

  return {
    validatePin: mutate,
    validatingPin: isPending,
    ...rest,
  };
};

export const useCreateAccountPin = (props: ValidatePinProps) => {
  const { onSuccess, onError, onReset } = props;
  const { mutate, isPending, ...rest } = useMutation({
    mutationFn: (accountPin: string) => accountService.CreatePin(accountPin),
    onSuccess: (values) => {
      if (onReset) {
        onReset();
      }

      if (onSuccess) {
        onSuccess(values.message);
      }
    },
    onError: (error: unknown) => {
      if (onError) {
        rest.reset();
        onError(handleAPIError(error));
      }
    },
  });

  return {
    createPin: mutate,
    creatingPin: isPending,
    ...rest,
  };
};
