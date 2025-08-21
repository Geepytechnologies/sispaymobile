import authEndpoints from "@/api/auth";
import axios from "axios";
import Auth from "@/utils/auth";

const useRefreshtoken = () => {
  const { getRefreshToken } = Auth;

  const refresh = async (accessToken: string | undefined | null) => {
    try {
      const refreshToken = await getRefreshToken();
      const response = await axios.post(`${authEndpoints.refreshtoken}`, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      // Expecting { result: { accessToken, refreshToken? } }
      return response.data.result as {
        accessToken: string;
        refreshToken?: string;
      };
    } catch (error) {
      // Swallow details here; caller will handle logout on failure
      if (axios.isAxiosError(error)) {
      }
    }
  };
  return refresh;
};

export default useRefreshtoken;
