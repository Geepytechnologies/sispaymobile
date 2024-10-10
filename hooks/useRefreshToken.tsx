import authEndpoints from "@/api/auth";
import { getFromStore } from "@/utils/localstorage";
import { Keys } from "@/constants/Keys";
import axios from "axios";

const useRefreshtoken = () => {
  //   const dispatch = useDispatch();
  const refreshToken = getFromStore(Keys.userRefreshToken);

  const refresh = async () => {
    try {
      const response = await axios.post(`${authEndpoints.refreshtoken}`, {
        token: refreshToken,
      });

      //   dispatch(SIGNIN(response.data));
      return response.data;
    } catch (error) {
      console.error("Refresh token error:", error);
    }
  };
  return refresh;
};

export default useRefreshtoken;
