import { isServer } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosError, AxiosHeaders } from "axios";
import toast from "react-hot-toast";

const token = process.env.NEXT_PUBLIC_CANVAS_TOKEN;
if (!token) {
  throw new Error("NEXT_PUBLIC_CANVAS_TOKEN not in environment");
}

export const axiosClient: AxiosInstance = axios.create();

if (!isServer) {
  axiosClient.interceptors.request.use((config) => {
    if (
      config.url &&
      config.url.startsWith("https://snow.instructure.com/api/v1/")
    ) {
      const newUrl = config.url.replace(
        "https://snow.instructure.com/api/v1/",
        "/api/canvas/"
      );
      config.url = newUrl;
    }
    return config;
  });
}

axiosClient.interceptors.request.use((config) => {
  if (
    config.url &&
    config.url.startsWith("https://snow.instructure.com/api/v1/")
  ) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

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
