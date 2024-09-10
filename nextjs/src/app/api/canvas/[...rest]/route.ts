import { NextRequest, NextResponse } from "next/server";
import { axiosClient } from "@/services/axiosUtils";

export async function GET(
  req: NextRequest,
  { params }: { params: { rest: string[] } }
) {
  const { rest } = params;
  const path = rest.join("/");

  try {
    const newUrl = `https://snow.instructure.com/api/v1/${path}`;
    const response = await axiosClient.get(newUrl, {
      headers: {
        // Include other headers from the incoming request if needed:
        // 'Content-Type': req.headers.get('content-type') || 'application/json',
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error.message || "Request failed" }),
      { status: error.response?.status || 500 }
    );
  }
}
