export interface LoginDTO {
  phone: string;
  password: string;
  pushtoken: string;
  deviceDetails: {
    deviceId: string | null;
    model: string | null;
    manufacturer: string | null;
  };
}
