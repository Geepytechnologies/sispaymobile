import {
  ApiRequestProps,
  ISuccessResponse,
} from "@/interfaces/general.interface";
import billpaymentService from "@/services/billpayment.service";
import { PurchaseCableTvDTO } from "@/types/billpayment";
import handleAPIError from "@/utils/apiErrorMessage";
import { useMutation } from "@tanstack/react-query";

interface BuyCableTvResponse {
  data: any;
}
export const useBuyCableTv = (props: ApiRequestProps) => {
  const { onSuccess, onError } = props;
  const { mutate, status, error, ...rest } = useMutation<
    ISuccessResponse,
    Error,
    PurchaseCableTvDTO
  >({
    mutationFn: async (tvDetails: PurchaseCableTvDTO) => {
      const response = await billpaymentService.PurchaseCableTv(tvDetails);
      return response.data;
    },

    onSuccess: (data) => {
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      if (onError) {
        rest.reset();
        onError(handleAPIError(error));
      }
    },
  });

  const isLoading = status == "pending";

  return {
    buyCableTv: mutate,
    buyCableTvLoading: isLoading,
    buyCableTvError: error,
  };
};
