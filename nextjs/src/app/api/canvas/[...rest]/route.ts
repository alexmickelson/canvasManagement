import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/services/axiosUtils";
import { withErrorHandling } from "@/services/withErrorHandling";

const getUrl = (params: { rest: string[] }) => {
  const { rest } = params;
  const path = rest.join("/");
  const newUrl = `https://snow.instructure.com/api/v1/${path}`;
  return newUrl;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  return withErrorHandling(async () => {
    try {
      const url = getUrl(params);
      const response = await axiosClient.get(url, {
        headers: {
          // Include other headers from the incoming request if needed:
          // 'Content-Type': req.headers.get('content-type') || 'application/json',
          "Content-Type": "application/json",
        },
      });

      return NextResponse.json(response.data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ error: error.message || "Canvas get request failed" }),
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
    try {
      const url = getUrl(params);
      const body = await req.json();
      const response = await axiosClient.post(url, body);
      return NextResponse.json(response.data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          error: error.message || "Canvas post request failed",
        }),
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
      const response = await axiosClient.put(url, body);
      return NextResponse.json(response.data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({ error: error.message || "Canvas put request failed" }),
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
      const response = await axiosClient.delete(url);
      return NextResponse.json(response.data);
    } catch (error: any) {
      return new NextResponse(
        JSON.stringify({
          error: error.message || "Canvas delete request failed",
        }),
        { status: error.response?.status || 500 }
      );
    }
  });
}
