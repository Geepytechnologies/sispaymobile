export interface LoginDTO {
  phone: string;
  password: string;
  pushtoken: string | null;
  deviceDetails: {
    deviceId: string | null;
    model: string | null;
    manufacturer: string | null;
  };
}

export interface TwoFactorAuthLoginDTO {
  pinId: string | null;
  otp: string | null;
  mobileNumber: string | null;
  pushtoken: string | null;
  deviceDetails: {
    deviceId: string | null;
    model: string | null;
    manufacturer: string | null;
  };
}
export interface VerifyOtpDTO {
  pinId: string | null;
  otp: string | null;
  mobileNumber: string | null;
}
export interface SendOtpDTO {
  name: string | null;
  mobileNumber: string | null;
}
