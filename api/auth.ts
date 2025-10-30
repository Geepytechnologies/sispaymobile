import { CONSTANTS } from "@/constants";

const authEndpoints = {
  login: `${CONSTANTS.APIURL}/auth/login`,
  biometriclogin: `${CONSTANTS.APIURL}/auth/BiometricLogin`,
  registerBiometric: `${CONSTANTS.APIURL}/auth/register-biometric`,
  register: `${CONSTANTS.APIURL}/auth/Register`,
  twoFactorAuth: `${CONSTANTS.APIURL}/auth/TwoFactorAuthLogin`,
  verifyotp: `${CONSTANTS.APIURL}/auth/VerifyOtp`,
  refreshtoken: `${CONSTANTS.APIURL}/auth/refreshtoken`,
};

export default authEndpoints;
