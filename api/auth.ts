import { CONSTANTS } from "@/constants";

const authEndpoints = {
  login: `${CONSTANTS.APIURL}/auth/login`,
  register: `${CONSTANTS.APIURL}/auth/Register`,
  refreshtoken: `${CONSTANTS.APIURL}/auth/refreshtoken`,
};

export default authEndpoints;
