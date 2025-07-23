import { assignmentMarkdownSerializer } from "@/features/local/assignments/models/utils/assignmentMarkdownSerializer";
import { groupByStartDate } from "@/features/local/utils/timeUtils";
import { fileStorageService } from "@/features/local/utils/fileStorageService";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { githubClassroomUrlPrompt } from "./github-classroom-prompt";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "list_current_courses",
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
            text: JSON.stringify({
              courseName: name,
            }),
          })),
        };
      }
    );
    server.tool(
      "list_assignments_for_course",
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
        console.log("mcp got assignments", assignments);

        return {
          //doesn't seem to work with many clients
          // content: assignments.map((a) => ({
          //   type: "resource_link",
          //   uri: `canvas:///courses/${courseName}/module/${a.moduleName}/assignments/${a.assignmentName}`,
          //   name: `${a.assignmentName}.md`,
          //   mimeType: "text/markdown",
          //   description: "An canvas assignment",
          // })),

          content: assignments.map((a) => ({
            type: "text",
            text: JSON.stringify({
              assignmentName: a.assignmentName,
              moduleName: a.moduleName,
            }),
          })),
        };
      }
    );

    server.tool(
      "get_assignment",
      "gets a markdown file defining the assignment",
      {
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
      },
      async ({ courseName, moduleName, assignmentName }) => {
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

        console.log("mcp assignment", assignment);
        return {
          content: [
            {
              type: "text",
              text: assignmentMarkdownSerializer.toMarkdown(assignment),
            },
          ],
        };
      }
    );
    server.tool(
      "get_github_classroom_url_instructions",
      "gets instructions for creating a GitHub Classroom assignment, call this to get a prompt showing how to create a GitHub Classroom assignment",
      {},
      async () => {
        return {
          content: [
            {
              type: "text",
              text: githubClassroomUrlPrompt,
            },
          ],
        };
      }
    );

    // resources dont integrate well right now
    // server.registerResource(
    //   "course_assignment",
    //   new ResourceTemplate(
    //     "canvas:///courses/{courseName}/module/{moduleName}/assignments/{assignmentName}",
    //     { list: undefined }
    //   ),
    //   {
    //     title: "Course Assignment",
    //     description: "Markdown representation of a course assignment",
    //   },
    //   async (uri, { courseName, moduleName, assignmentName }) => {
    //     if (
    //       typeof courseName !== "string" ||
    //       typeof moduleName !== "string" ||
    //       typeof assignmentName !== "string"
    //     ) {
    //       throw new Error(
    //         "courseName, moduleName, and assignmentName must be strings"
    //       );
    //     }
    //     const assignment = await fileStorageService.assignments.getAssignment(
    //       courseName,
    //       moduleName,
    //       assignmentName
    //     );
    //     return {
    //       contents: [
    //         {
    //           uri: uri.href,
    //           text: assignment.description,
    //         },
    //       ],
    //     };
    //   }
    // );
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
