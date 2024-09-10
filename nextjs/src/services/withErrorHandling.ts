import { NextResponse } from "next/server";

export async function withErrorHandling(handler: () => Promise<Response | NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    console.error("Error caught in centralized handler:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
