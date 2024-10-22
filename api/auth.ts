import { CONSTANTS } from "@/constants";

const authEndpoints = {
  login: `${CONSTANTS.APIURL}/auth/login`,
  register: `${CONSTANTS.APIURL}/auth/Register`,
  twoFactorAuth: `${CONSTANTS.APIURL}/auth/TwoFactorAuthLogin`,
  verifyotp: `${CONSTANTS.APIURL}/auth/VerifyOtp`,
  refreshtoken: `${CONSTANTS.APIURL}/auth/refreshtoken`,
};

export default authEndpoints;
