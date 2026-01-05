import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { z } from "zod";
import { router } from "../../../services/serverFunctions/trpcSetup";
import {
  LocalAssignment,
  zodLocalAssignment,
} from "@/features/local/assignments/models/localAssignment";
import path from "path";
import { getCoursePathByName } from "../globalSettings/globalSettingsFileStorageService";
import { promises as fs } from "fs";
import { courseItemFileStorageService } from "../course/courseItemFileStorageService";
import { assignmentMarkdownSerializer } from "./models/utils/assignmentMarkdownSerializer";
import { assertValidFileName } from "@/services/fileNameValidation";

export const assignmentRouter = router({
  getAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName, assignmentName } }) => {
      return await courseItemFileStorageService.getItem({
        courseName,
        moduleName,
        name: assignmentName,
        type: "Assignment",
      });
    }),
  getAllAssignments: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      const assignments = await courseItemFileStorageService.getItems({
        courseName,
        moduleName,
        type: "Assignment",
      });
      return assignments;
    }),
  createAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
        assignment: zodLocalAssignment,
      })
    )
    .mutation(
      async ({
        input: { courseName, moduleName, assignmentName, assignment },
      }) => {
        await updateOrCreateAssignmentFile({
          courseName,
          moduleName,
          assignmentName,
          assignment,
        });
      }
    ),
  updateAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        previousModuleName: z.string(),
        previousAssignmentName: z.string(),
        assignmentName: z.string(),
        assignment: zodLocalAssignment,
      })
    )
    .mutation(
      async ({
        input: {
          courseName,
          moduleName,
          assignmentName,
          assignment,
          previousModuleName,
          previousAssignmentName,
        },
      }) => {
        await updateOrCreateAssignmentFile({
          courseName,
          moduleName,
          assignmentName,
          assignment,
        });

        if (
          assignmentName !== previousAssignmentName ||
          moduleName !== previousModuleName
        ) {
          await deleteAssignment({
            courseName,
            moduleName: previousModuleName,
            assignmentName: previousAssignmentName,
          });
        }
      }
    ),
  deleteAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
      })
    )
    .mutation(async ({ input: { courseName, moduleName, assignmentName } }) => {
      await deleteAssignment({
        courseName,
        moduleName,
        assignmentName,
      });
    }),
});

export async function updateOrCreateAssignmentFile({
  courseName,
  moduleName,
  assignmentName,
  assignment,
}: {
  courseName: string;
  moduleName: string;
  assignmentName: string;
  assignment: LocalAssignment;
}) {
  assertValidFileName(assignmentName);

  const courseDirectory = await getCoursePathByName(courseName);
  const folder = path.join(courseDirectory, moduleName, "assignments");
  await fs.mkdir(folder, { recursive: true });

  const filePath = path.join(
    courseDirectory,
    moduleName,
    "assignments",
    assignmentName + ".md"
  );

  const assignmentMarkdown =
    assignmentMarkdownSerializer.toMarkdown(assignment);
  console.log(`Saving assignment ${filePath}`);

  await fs.writeFile(filePath, assignmentMarkdown);
}

async function deleteAssignment({
  courseName,
  moduleName,
  assignmentName,
}: {
  courseName: string;
  moduleName: string;
  assignmentName: string;
}) {
  const courseDirectory = await getCoursePathByName(courseName);
  const filePath = path.join(
    courseDirectory,
    moduleName,
    "assignments",
    assignmentName + ".md"
  );
  console.log("removing assignment", filePath);
  await fs.unlink(filePath);
}
