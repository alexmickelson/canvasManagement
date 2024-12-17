import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/services/axiosUtils";
import { withErrorHandling } from "@/services/withErrorHandling";
import { isAxiosError } from "axios";

const appendQueryParams = (url: URL, req: NextRequest) => {
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });
};

const getUrl = (params: { rest: string[] }, req: NextRequest) => {
  const { rest } = params;
  const path = rest.join("/");
  const newUrl = `https://snow.instructure.com/api/v1/${path}`;
  const url = new URL(newUrl);

  appendQueryParams(url, req);

  return url;``
};

const proxyResponseHeaders = (response: any) => {
  const headers = new Headers();
  Object.entries(response.headers).forEach(([key, value]) => {
    if (["link", "x-rate-limit-remaining"].includes(key))
      headers.set(key, value as string);
  });
  return headers;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> }
) {
  try {
    const url = getUrl(await params, req);

    const response = await axiosClient.get(url.toString());
    const headers = proxyResponseHeaders(response);
    return NextResponse.json(response.data, { headers });
  } catch (error: any) {
    console.log("canvas get error", error, error?.message);
    return NextResponse.json(
      JSON.stringify({ error: error.message || "Canvas GET request failed" }),
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> }
) {
  return withErrorHandling(async () => {
    const url = getUrl(await params, req);
    const body = await req.json();
    let response;
    try {
      response = await axiosClient.post(url.toString(), body);

      const headers = proxyResponseHeaders(response);
      return new NextResponse(JSON.stringify(response.data), { headers });
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log(url.toString(), body);
        console.log("response data", JSON.stringify(error.response?.data));
        console.log("is axios error");
      }
      return NextResponse.json(
        {
          error: error.message || "Canvas POST request failed",
        },
        { status: error.response?.status || 500 }
      );
    }
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> }
) {
  return withErrorHandling(async () => {
    const url = getUrl(await params, req);
    const body = await req.json();
    try {
      const response = await axiosClient.put(url.toString(), body);

      const headers = proxyResponseHeaders(response);
      return new NextResponse(JSON.stringify(response.data), { headers });
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log(url.toString(), body);
        console.log("response data", JSON.stringify(error.response?.data));
        console.log("is axios error");

        return NextResponse.json(
          {
            error: error.response?.data ?? "Canvas put failed",
          },
          { status: error.response?.status || 500 }
        );
      }
      return NextResponse.json(
        {
          error: error.message || "Canvas POST request failed",
        },
        { status: error.response?.status || 500 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> }
) {
  return withErrorHandling(async () => {
    try {
      const url = getUrl(await params, req);
      const response = await axiosClient.delete(url.toString());

      const headers = proxyResponseHeaders(response);
      return new NextResponse(JSON.stringify(response.data), { headers });
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          error: error.message || "Canvas DELETE request failed",
        }),
        { status: error.response?.status || 500 }
      );
    }
  });
}
