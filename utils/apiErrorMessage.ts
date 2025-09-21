import { ISuccessResponse } from "@/interfaces/general.interface";
import axios, { AxiosError } from "axios";

const handleAPIError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ISuccessResponse>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      // Handle 400 specifically
      if (status === 400) {
        return data.message || "One or more validation errors occurred.";
      }

      if (data?.error && Array.isArray(data.error)) {
        return data.error.map((e: any) => e.message).join("\n");
      }

      return data?.message || axiosError.message;
    }

    return axiosError.message;
  }

  return (error as Error).message || "An unexpected error occurred";
};

export default handleAPIError;
