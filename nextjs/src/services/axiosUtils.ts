import axios, { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";

export const axiosClient: AxiosInstance = axios.create();

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.log("response error", error.response);
      const responseErrorText =
        typeof error.response.data === "object"
          ? (error.response.data as any).error
          : error.response.data;
      toast.error(
        `Error: ${error.response.status} - ${responseErrorText}, ${decodeURI(
          error.response.config.url ?? ""
        )}`
      );
    } else if (error.request) {
      toast.error("Error: No response from server");
    } else {
      toast.error(`Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);
