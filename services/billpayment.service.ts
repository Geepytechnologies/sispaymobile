import { axiosInstance } from "@/config/axios";
import { PurchaseAirtimeDTO } from "@/types/billpayment";
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
  async getProductCategories(id: string) {
    try {
      const response = await axiosInstance.get(
        `/BillPayment/GetProductCategories/${id}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching product categories:", error);
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

      return response.data;
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

      return response.data;
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

      return response.data;
    } catch (error) {
      console.error("Error fetching utilitybill service category:", error);
      throw error;
    }
  }
  async purchaseAirtime(details: PurchaseAirtimeDTO) {
    try {
      const response = await axiosInstance.post(
        `/BillPayment/purchaseAirtime`,
        { details }
      );

      return response.data;
    } catch (error) {
      console.error("Error purchasing airtime:", error);
      throw error;
    }
  }
}

export default new BillPaymentService();
