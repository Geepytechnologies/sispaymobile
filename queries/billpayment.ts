import {
  ApiRequestProps,
  ISuccessResponse,
} from "@/interfaces/general.interface";
import {
  GetProductCategoriesParams,
  VerifyCableTvProps,
  VerifyUtilityProps,
} from "@/interfaces/queryprops.interface";
import {
  IVerifyCableTvDTO,
  IVerifyPowerDataDTO,
} from "@/interfaces/requests/billpayment.interface";
import {
  IVerifyCableTvResponse,
  IVerifyPowerResponse,
} from "@/interfaces/responses/billpayment.interface";
import billpaymentService from "@/services/billpayment.service";
import {
  PurchaseCableTvDTO,
  PurchaseUtilityBillDTO,
} from "@/types/billpayment";
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
export const useBuyElectricity = (props: ApiRequestProps) => {
  const { onSuccess, onError } = props;
  const { mutate, status, error, ...rest } = useMutation<
    ISuccessResponse,
    Error,
    PurchaseUtilityBillDTO
  >({
    mutationFn: async (details: PurchaseUtilityBillDTO) => {
      const response = await billpaymentService.PurchaseElectricity(details);
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
    buyElectricity: mutate,
    buyingElectricity: isLoading,
    buyElectricityError: error,
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

export const useProductCategories = (params: GetProductCategoriesParams) => {
  const { data, isLoading } = useQuery({
    queryKey: ["productcategories", params],
    queryFn: () => billpaymentService.getProductCategories(params),
    enabled: !!params.id,
  });
  return {
    productCategories: data || [],
    fetchingProductCategory: isLoading,
  };
};

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

export const useVerifyPower = (props: VerifyUtilityProps) => {
  const { onSuccess, onError } = props;
  const { mutate, status, error, ...rest } = useMutation<
    IVerifyPowerResponse,
    Error,
    IVerifyPowerDataDTO
  >({
    mutationFn: async (details: IVerifyPowerDataDTO) => {
      const response = await billpaymentService.verifyPowerData(details);
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
    verifyPower: mutate,
    verifyingPower: isLoading,
    verifyPowerError: error,
  };
};

export const useVerifyCableTv = (props: VerifyCableTvProps) => {
  const { onSuccess, onError } = props;
  const { mutate, status, error, ...rest } = useMutation<
    IVerifyCableTvResponse,
    Error,
    IVerifyCableTvDTO
  >({
    mutationFn: async (details: IVerifyCableTvDTO) => {
      const response = await billpaymentService.verifyCableTvData(details);
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
    verifyCableTv: mutate,
    verifyingCableTv: isLoading,
    verifyCableTvError: error,
  };
};
