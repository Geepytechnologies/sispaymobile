import { CONSTANTS } from "@/constants";
import { VerifyAndCreateAccountDTO } from "@/types/AccountDTO";
import axios, { AxiosInstance } from "axios";
export enum VerificationType {
  BVN,
  NIN,
}
class AccountService {
  async getUserAccount(axiosPrivate: AxiosInstance) {
    try {
      const res = await axiosPrivate.get("/Account/GetUserAccount");
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Get user account error::", {
          statusCode: error.response?.status, // The status code
          message: error.message, // The error message
          data: error.response?.data, // The response data
        });
      }
      //   console.error("Get user account error:", error);
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
}

export default new AccountService();
