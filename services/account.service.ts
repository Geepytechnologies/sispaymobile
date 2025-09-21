import { CONSTANTS } from "@/constants";
import { IAccountResponse } from "@/interfaces/responses/account.interface";
import { VerifyAndCreateAccountDTO } from "@/types/AccountDTO";
import { getRequest, postRequest } from "@/utils/apiCaller";
import axios, { AxiosInstance } from "axios";
import { axiosInstance } from "@/config/axios";
import { ISuccessResponse } from "@/interfaces/general.interface";
import { ValidatePinRequest } from "@/interfaces/requests/account.interface";
export enum VerificationType {
  BVN,
  NIN,
}
class AccountService {
  async getUserAccount() {
    try {
      const res = await getRequest<IAccountResponse>({
        url: "/Account/GetUserAccount",
      });
      return res.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Get user account error::", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      throw error;
    }
  }

  async InitiateVerification(type: string, Number: string) {
    try {
      const res = await axios.post(
        `${CONSTANTS.APIURL}/Account/InitiateVerification?Type=${type}&Number=${Number}`
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Initiate verification error::", {
          statusCode: error.response?.status, // The status code
          message: error.message, // The error message
          data: error.response?.data, // The response data
        });
      }
      //   console.error("Initiate verification error:", error);
      throw error;
    }
  }

  async VerifyAndCreateAccount(details: VerifyAndCreateAccountDTO) {
    try {
      const res = await axios.post(
        `${CONSTANTS.APIURL}/Account/VerifyAndCreateAccount`,
        details
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Verify and create account error::", {
          statusCode: error.response?.status, // The status code
          message: error.message, // The error message
          data: error.response?.data, // The response data
        });
      }
      //   console.error("Verify and create account error:", error);
      throw error;
    }
  }

  async CreatePin(accountPin: string) {
    return await postRequest<ValidatePinRequest, ISuccessResponse>({
      url: `${CONSTANTS.APIURL}/Account/CreatePin`,
      payload: { accountPin: accountPin },
    });
  }
  async ValidatePin(accountPin: string) {
    return await postRequest<ValidatePinRequest, ISuccessResponse>({
      url: `${CONSTANTS.APIURL}/Account/ValidatePin`,
      payload: { accountPin },
    });
  }

  async ChangePin(api: AxiosInstance, oldPin: string, newPin: string) {
    try {
      const res = await api.post(
        `${CONSTANTS.APIURL}/Account/ChangePin?oldAccountPin=${oldPin}&newAccountPin=${newPin}`
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Change pin error::", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      //   console.error("Verify and create account error:", error);
      throw error;
    }
  }
  async sendOtpForForgotPin(api: AxiosInstance) {
    try {
      const res = await api.post(
        `${CONSTANTS.APIURL}/Account/ForgotPin/sendOtp`
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("send otp error::", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      //   console.error("Verify and create account error:", error);
      throw error;
    }
  }
  async confirmOtpForForgotPin(
    api: AxiosInstance,
    pinId: string,
    otp: string,
    mobileNumber: string
  ) {
    try {
      const res = await api.post(
        `${CONSTANTS.APIURL}/Account/ForgotPin/confirmOtp?PinId=${pinId}&Otp=${otp}&MobileNumber=${mobileNumber}`
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("send otp error::", {
          statusCode: error.response?.status,
          message: error.message,
          data: error.response?.data,
        });
      }
      //   console.error("Verify and create account error:", error);
      throw error;
    }
  }
}

export default new AccountService();
