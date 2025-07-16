import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { groupByStartDate } from "@/models/local/utils/timeUtils";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "get_current_courses",
      "gets courses for the current term",
      {},
      async () => {
        const settingsList =
          await fileStorageService.settings.getAllCoursesSettings();

        const coursesByStartDate = groupByStartDate(settingsList);

        const sortedDates = Object.keys(coursesByStartDate).sort().reverse();

        const mostRecentStartDate = sortedDates[0];

        const courseNames = coursesByStartDate[mostRecentStartDate].map(
          (settings) => settings.name
        );
        return {
          content: courseNames.map((name) => ({
            type: "text",
            text: name,
          })),
        };
      }
    );
  },
  {
    serverInfo: {
      name: "Canvas Management MCP Server",
      version: "2.0.0",
    },
  },
  {
    basePath: "/api/mcp",
    maxDuration: 60,
    verboseLogs: true,
  }
);
export { handler as GET, handler as POST };
