import { ISuccessResponse } from "@/interfaces/responses/general.interface";
import axios, { AxiosError } from "axios";

const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    //error is of type AxiosError
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      if (axiosError.response.status === 400) {
        return "One or more validation errors occurred.";
      }
      const serverErrorResponse = axiosError.response.data as ISuccessResponse;
      if (
        serverErrorResponse.error &&
        Array.isArray(serverErrorResponse.error)
      ) {
        const errorResponse = serverErrorResponse.error;

        const errorMessage = errorResponse.map((e) => e.message).join("\n");
        return errorMessage;
      }

      return serverErrorResponse.message;
    } else {
      //non-server error occured
      return axiosError.message;
    }
  } else {
    //unexpected error
    return (error as Error).message;
  }
};

export default handleAPIError;
