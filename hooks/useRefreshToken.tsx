import authEndpoints from "@/api/auth";
import { getFromStore } from "@/utils/localstorage";
import { Keys } from "@/constants/Keys";
import axios, { isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/config/store";

const useRefreshtoken = () => {
  const { currentuser } = useSelector((state: RootState) => state.user);

  const refreshToken = currentuser?.refreshToken;

  const refresh = async (accessToken: string | null) => {
    try {
      const { refreshToken } = await getFromStore("sispayuser");
      const response = await axios.post(`${authEndpoints.refreshtoken}`, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      return response.data.result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.error("Refresh token error:", error);
      }
    }
  };
  return refresh;
};

export default useRefreshtoken;
