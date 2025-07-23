import { baseCanvasUrl } from "@/features/canvas/services/canvasServiceUtils";
import { isServer } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosError } from "axios";
import toast from "react-hot-toast";

const canvasBaseUrl = "https://snow.instructure.com/api/v1/";

export const axiosClient: AxiosInstance = axios.create();

if (!isServer) {
  axiosClient.interceptors.request.use((config) => {
    if (config.url && config.url.startsWith(canvasBaseUrl)) {
      const newUrl = config.url.replace(canvasBaseUrl, "/api/canvas/");
      config.url = newUrl;
    }
    return config;
  });
} else {
  const token = process.env.CANVAS_TOKEN;
  if (!token) {
    console.error("CANVAS_TOKEN not in environment");
  } else {
    axiosClient.interceptors.request.use((config) => {
      if (config.url && config.url.startsWith(canvasBaseUrl)) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    });
  }
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = getAxiosErrorMessage(error);
    if (errorMessage) toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export function getAxiosErrorMessage(error: AxiosError) {
  if (error.response) {
    console.log("response error", error.response);
    const responseErrorText =
      typeof error.response.data === "object"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error.response.data as any).error
        : error.response.data;

    if (
      !isServer &&
      error.config?.method?.toUpperCase() !== "GET" &&
      error.response.status !== 403 &&
      !error.config?.url?.includes(baseCanvasUrl)
    ) {
      return `Error: ${
        error.response.status
      } - ${responseErrorText}, ${decodeURI(error.response.config.url ?? "")}`;
    }
  } else if (error.request) {
    if (!isServer) {
      return "Error: No response from server";
    }
  } else {
    if (!isServer) {
      return `Error: ${error.message}`;
    }
  }
  return "";
}
