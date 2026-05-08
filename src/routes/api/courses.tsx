import { createFileRoute } from "@tanstack/react-router";
import { createAsyncCaller } from "@/services/serverFunctions/appRouter";

export const Route = createFileRoute("/api/courses")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const caller = await createAsyncCaller();
          return Response.json(await caller.settings.allCoursesSettings());
        } catch (error) {
          return Response.json(
            { error: (error as Error).message || "Internal Server Error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
