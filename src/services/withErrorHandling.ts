export async function withErrorHandling(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    console.error("Error caught in centralized handler:", error);
    return Response.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
