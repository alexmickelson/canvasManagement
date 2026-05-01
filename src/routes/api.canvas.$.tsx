import { createFileRoute } from "@tanstack/react-router";
import { axiosClient } from "@/services/axiosUtils";
import { isAxiosError } from "axios";

const appendQueryParams = (url: URL, req: Request) => {
  const reqUrl = new URL(req.url);
  reqUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
};

const getUrl = (splat: string | undefined, req: Request) => {
  const path = splat ?? "";
  const newUrl = `https://snow.instructure.com/api/v1/${path}`;
  const url = new URL(newUrl);
  appendQueryParams(url, req);
  return url;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxyResponseHeaders = (response: any) => {
  const headers = new Headers();
  Object.entries(response.headers).forEach(([key, value]) => {
    if (["link", "x-rate-limit-remaining"].includes(key))
      headers.set(key, value as string);
  });
  return headers;
};

async function withErrorHandling(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    console.error("Canvas proxy error:", error);
    return Response.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const Route = createFileRoute("/api/canvas/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const url = getUrl(params._splat, request);
          const response = await axiosClient.get(url.toString());
          const headers = proxyResponseHeaders(response);
          return Response.json(response.data, { headers });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log("canvas get error", error, error?.message);
          return Response.json(
            { error: error.message || "Canvas GET request failed" },
            { status: error.response?.status || 500 },
          );
        }
      },

      POST: ({ request, params }) =>
        withErrorHandling(async () => {
          const url = getUrl(params._splat, request);
          const body = await request.json();
          try {
            const response = await axiosClient.post(url.toString(), body);
            const headers = proxyResponseHeaders(response);
            return new Response(JSON.stringify(response.data), { headers });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (isAxiosError(error)) {
              console.log(url.toString(), body);
              console.log(
                "response data",
                JSON.stringify(error.response?.data),
              );
            }
            return Response.json(
              { error: error.message || "Canvas POST request failed" },
              { status: error.response?.status || 500 },
            );
          }
        }),

      PUT: ({ request, params }) =>
        withErrorHandling(async () => {
          const url = getUrl(params._splat, request);
          const body = await request.json();
          try {
            const response = await axiosClient.put(url.toString(), body);
            const headers = proxyResponseHeaders(response);
            return new Response(JSON.stringify(response.data), { headers });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (isAxiosError(error)) {
              console.log(url.toString(), body);
              console.log(
                "response data",
                JSON.stringify(error.response?.data),
              );
              return Response.json(
                { error: error.response?.data ?? "Canvas PUT failed" },
                { status: error.response?.status || 500 },
              );
            }
            return Response.json(
              { error: error.message || "Canvas PUT request failed" },
              { status: 500 },
            );
          }
        }),

      DELETE: ({ request, params }) =>
        withErrorHandling(async () => {
          try {
            const url = getUrl(params._splat, request);
            const response = await axiosClient.delete(url.toString());
            const headers = proxyResponseHeaders(response);
            return new Response(JSON.stringify(response.data), { headers });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            return new Response(
              JSON.stringify({
                error: error.message || "Canvas DELETE request failed",
              }),
              { status: error.response?.status || 500 },
            );
          }
        }),
    },
  },
});
