import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/services/axiosUtils";
import { withErrorHandling } from "@/services/withErrorHandling";
import {
  AxiosResponseHeaders,
  isAxiosError,
  RawAxiosResponseHeaders,
} from "axios";

const getUrl = (params: { rest: string[] }) => {
  const { rest } = params;
  const path = rest.join("/");
  const newUrl = `https://snow.instructure.com/api/v1/${path}`;
  return new URL(newUrl);
};

const getNextUrl = (
  headers: AxiosResponseHeaders | RawAxiosResponseHeaders
): string | undefined => {
  const linkHeader: string | undefined =
    typeof headers.get === "function"
      ? (headers.get("link") as string)
      : ((headers as RawAxiosResponseHeaders)["link"] as string);

  if (!linkHeader) {
    console.log("could not find link header in the response");
    return undefined;
  }

  const links = linkHeader.split(",").map((link) => link.trim());
  const nextLink = links.find((link) => link.includes('rel="next"'));

  if (!nextLink) {
    console.log(
      "could not find next url in link header, reached end of pagination"
    );
    return undefined;
  }

  const nextUrl = nextLink.split(";")[0].trim().slice(1, -1);
  return nextUrl;
};

const proxyResponseHeaders = (response: any) => {
  const headers = new Headers();
  Object.entries(response.headers).forEach(([key, value]) => {
    headers.set(key, value as string);
  });
  return headers;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return withErrorHandling(async () => {
    try {
      const url = getUrl(params);

      var requestCount = 1;
      url.searchParams.set("per_page", "100");

      const { data: firstData, headers: firstHeaders } = await axiosClient.get(
        url.toString()
      );

      if (!Array.isArray(firstData)) {
        return NextResponse.json(firstData);
      }

      var returnData = firstData;
      var nextUrl = getNextUrl(firstHeaders);

      while (nextUrl) {
        requestCount += 1;
        const { data, headers } = await axiosClient.get(nextUrl);
        if (data) {
          returnData = [...returnData, data];
        }
        nextUrl = getNextUrl(headers);
      }

      if (requestCount > 1) {
        console.log(
          `Requesting ${typeof returnData} took ${requestCount} requests`
        );
      }

      return NextResponse.json(returnData);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ error: error.message || "Canvas GET request failed" }),
        { status: error.response?.status || 500 }
      );
    }
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return withErrorHandling(async () => {
    const url = getUrl(params);
    const body = await req.json();
    let response;
    try {
      response = await axiosClient.post(url.toString(), body);

      const headers = proxyResponseHeaders(response);
      return new NextResponse(JSON.stringify(response.data), { headers });
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log(url.toString(), body);
        console.log("response data", JSON.stringify( error.response?.data));
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
  { params }: { params: { rest: string[] } }
) {
  return withErrorHandling(async () => {
    try {
      const url = getUrl(params);
      const body = await req.json();
      const response = await axiosClient.put(url.toString(), body);

      const headers = proxyResponseHeaders(response);
      return new NextResponse(JSON.stringify(response.data), { headers });
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ error: error.message || "Canvas PUT request failed" }),
        { status: error.response?.status || 500 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return withErrorHandling(async () => {
    try {
      const url = getUrl(params);
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
