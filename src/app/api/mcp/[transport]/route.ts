import { LocalCourseSettings } from "@/models/local/localCourseSettings";
import { groupByStartDate } from "@/models/local/utils/timeUtils";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
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
    server.tool(
      "get_assignments_for_course",
      "gets assignments and modules for a course",
      {
        courseName: z.string(),
      },
      async ({ courseName }) => {
        const modules = await fileStorageService.modules.getModuleNames(
          courseName
        );
        const assignments = (
          await Promise.all(
            modules.map(async (moduleName) => {
              const assignments =
                await fileStorageService.assignments.getAssignments(
                  courseName,
                  moduleName
                );
              return assignments.map((assignment) => ({
                assignmentName: assignment.name,
                moduleName,
              }));
            })
          )
        ).flat();

        return {
          content: assignments.map((a) => ({
            type: "resource_link",
            uri: `canvas:///courses/${courseName}/module/${a.moduleName}/assignments/${a.assignmentName}`,
            name: `${a.assignmentName}.md`,
            mimeType: "text/markdown",
            description: "An canvas assignment",
          })),
        };
      }
    );

    server.registerResource(
      "course_assignment",
      new ResourceTemplate(
        "canvas:///courses/{courseName}/module/{moduleName}/assignments/{assignmentName}",
        { list: undefined }
      ),
      {
        title: "Course Assignment",
        description: "Markdown representation of a course assignment",
      },
      async (uri, { courseName, moduleName, assignmentName }) => {
        if (
          typeof courseName !== "string" ||
          typeof moduleName !== "string" ||
          typeof assignmentName !== "string"
        ) {
          throw new Error(
            "courseName, moduleName, and assignmentName must be strings"
          );
        }
        const assignment = await fileStorageService.assignments.getAssignment(
          courseName,
          moduleName,
          assignmentName
        );
        return {
          contents: [
            {
              uri: uri.href,
              text: assignment.description,
            },
          ],
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
