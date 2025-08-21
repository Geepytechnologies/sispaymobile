import {
  ApiRequestProps,
  ISuccessResponse,
} from "@/interfaces/general.interface";
import billpaymentService from "@/services/billpayment.service";
import { PurchaseCableTvDTO } from "@/types/billpayment";
import handleAPIError from "@/utils/apiErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useAirtimeCategories = () =>
  useQuery({
    queryKey: ["airtimecategories"],
    queryFn: billpaymentService.getAirtimeServiceCategory,
  });

export const useDataCategories = () =>
  useQuery({
    queryKey: ["datacategories"],
    queryFn: billpaymentService.getDataServiceCategory,
  });

export const useProductCategories = (id: string | undefined) =>
  useQuery({
    queryKey: ["productcategories", id],
    queryFn: () => billpaymentService.getProductCategories(id),
    enabled: !!id,
  });

export const useVtuDataPlans = () =>
  useQuery({
    queryKey: ["vtudataplans"],
    queryFn: billpaymentService.getVtuDataPlans,
  });

export const useCableTvCategories = () =>
  useQuery({
    queryKey: ["tvcategories"],
    queryFn: billpaymentService.getCableTvServiceCategory,
  });

export const useUtilityBillCategories = () =>
  useQuery({
    queryKey: ["utilitybillcategories"],
    queryFn: billpaymentService.getUtilityBillServiceCategory,
  });
