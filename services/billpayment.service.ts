import { axiosInstance } from "@/config/axios";
import { GetProductCategoriesParams } from "@/interfaces/queryprops.interface";
import {
  IVerifyCableTvDTO,
  IVerifyPowerDataDTO,
} from "@/interfaces/requests/billpayment.interface";
import { IServiceCategoryResponse } from "@/interfaces/responses/billpayment.interface";
import {
  PurchaseAirtimeDTO,
  PurchaseCableTvDTO,
  PurchaseDataDTO,
  PurchaseUtilityBillDTO,
  PurchaseVtuDataDTO,
} from "@/types/billpayment";
import { getRequest, getRequestParams } from "@/utils/apiCaller";
import axios from "axios";

class BillPaymentService {
  async getServices() {
    try {
      const response = await axiosInstance.get("/BillPayment/GetServices");

      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }
  async getProductCategories(params: GetProductCategoriesParams) {
    try {
      const response = await getRequestParams<
        GetProductCategoriesParams,
        IServiceCategoryResponse
      >({
        url: `/BillPayment/GetProductCategories`,
        params,
      });

      return response.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching product categories::", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      throw error;
    }
  }
  async getUtilityBillProductCategories(id: string) {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/GetUtilitybillProductCategories/${id}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching utilitybill product categories:", error);
      throw error;
    }
  }
  async getAirtimeServiceCategory() {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/ServiceCategory/Airtime`
      );

      return response.data.result;
    } catch (error) {
      console.error("Error fetching airtime service category:", error);
      throw error;
    }
  }
  async getDataServiceCategory() {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/ServiceCategory/Data`
      );

      return response.data.result;
    } catch (error) {
      console.error("Error fetching data service category:", error);
      throw error;
    }
  }
  async getCableTvServiceCategory() {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/ServiceCategory/CableTV`
      );

      return response.data.result;
    } catch (error) {
      console.error("Error fetching cabletv service category:", error);
      throw error;
    }
  }
  async getUtilityBillServiceCategory() {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/ServiceCategory/UtilityBill`
      );

      return response.data.result;
    } catch (error) {
      console.error("Error fetching utilitybill service category:", error);
      throw error;
    }
  }
  async getVtuDataPlans() {
    try {
      const response = await axiosInstance.get(`/VTU/Data/Plans`);
      return response.data.result;
    } catch (error) {
      console.error("Error fetching VTU data plans:", error);
      throw error;
    }
  }
  async purchaseAirtime(details: PurchaseAirtimeDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/purchaseAirtime`,
        details
      );

      return response.data;
    } catch (error) {
      // console.error("Error purchasing airtime:", error);
      throw error;
    }
  }
  async purchaseData(details: PurchaseDataDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/purchaseData`,
        details
      );

      return response.data;
    } catch (error) {
      console.error("Error purchasing data:", error);
      throw error;
    }
  }
  async PurchaseVTUData(details: PurchaseVtuDataDTO) {
    try {
      const response = await axiosInstance.post(`/VTU/data/purchase`, details);

      return response.data;
    } catch (error) {}
  }
  async PurchaseCableTv(details: PurchaseCableTvDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/CableTvSubscription`,
        details
      );

      return response.data;
    } catch (error) {
      console.error("Error purchasing cabletv:", error);
      throw error;
    }
  }
  async PurchaseElectricity(details: PurchaseUtilityBillDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/PayUtilityBill`,
        details
      );

      return response.data;
    } catch (error) {
      console.error("Error purchasing electricity:", error);
      throw error;
    }
  }
  async verifyCableTvData(details: IVerifyCableTvDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/VerifyCableTv`,
        details
      );

      return response;
    } catch (error) {
      console.error("Error verifying cabletv:", error);
      throw error;
    }
  }
  async verifyPowerData(details: IVerifyPowerDataDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/VerifyPower`,
        details
      );

      return response.data;
    } catch (error) {
      console.error("Error verifying power:", error);
      throw error;
    }
  }
}

export default new BillPaymentService();
