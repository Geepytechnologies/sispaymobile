import { JwtPayload } from "jwt-decode";

export interface IUserResponse extends JwtPayload {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  dateOfBirth: string;
  homeAddress: string;
  stateOfOrigin: string;
  lga: string;
  imageUrl: string;
  accountPinSet: boolean;
  kyc: boolean;
  accessToken: string;
  refreshToken: string;
}
