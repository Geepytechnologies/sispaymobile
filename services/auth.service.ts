import authEndpoints from "@/api/auth";
import { LoginDTO } from "@/types/LoginDTO";
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

  async Register(userDetails: RegisterDTO) {
    try {
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
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }
  async Logout() {
    await deleteFromStore("sispayuser");
  }
}

export default new AuthService();
