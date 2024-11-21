import authEndpoints from "@/api/auth";
import { CONSTANTS } from "@/constants";
import {
  LoginDTO,
  SendOtpDTO,
  TwoFactorAuthLoginDTO,
  VerifyOtpDTO,
} from "@/types/LoginDTO";
import { RegisterDTO } from "@/types/RegisterDTO";
import { deleteFromStore } from "@/utils/localstorage";
import axios from "axios";

class AuthService {
  async signin(credentials: LoginDTO) {
    try {
      const response = await axios.post(`${authEndpoints.login}`, credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        // Log detailed error information
        console.error("Login error:", {
          statusCode: error.response?.status, // The status code
          message: error.message, // The error message
          data: error.response?.data, // The response data
        });
      } else {
        // Handle unexpected errors
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  }
  async TwoFactorAuthLogin(details: TwoFactorAuthLoginDTO) {
    try {
      const response = await axios.post(
        `${authEndpoints.twoFactorAuth}`,
        details
      );
      return response.data;
    } catch (error) {
      console.error("Two-Factor Auth Login error:", error);
      throw error;
    }
  }
  async VerifyOtp(details: VerifyOtpDTO) {
    try {
      const response = await axios.post(`${authEndpoints.verifyotp}`, details);
      return response.data;
    } catch (error) {
      console.error("Two-Factor Auth Login error:", error);
      throw error;
    }
  }
  async SendOtp(details: SendOtpDTO) {
    try {
      const response = await axios.post(
        `${CONSTANTS.APIURL}/auth/sendOtp`,
        details
      );
      return response.data;
    } catch (error) {
      console.error("Send Otp error:", error);
      throw error;
    }
  }
  async Register(userDetails: RegisterDTO) {
    const response = await axios.post(`${authEndpoints.register}`, {
      firstname: userDetails.firstname,
      lastname: userDetails.lastname,
      middlename: userDetails.middlename,
      phoneNumber: userDetails.phoneNumber,
      email: userDetails.email,
      password: userDetails.password,
      businessName: userDetails.businessName,
    });
    return response.data;
  }
  async Logout() {
    await deleteFromStore("sispayuser");
  }
}

export default new AuthService();
