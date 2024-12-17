import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpcSetup";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";
import { zodLocalAssignment } from "@/models/local/assignment/localAssignment";

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
      const assignment = await fileStorageService.assignments.getAssignment(
        courseName,
        moduleName,
        assignmentName
      );
      // console.log(assignment);
      return assignment;
    }),
  getAllAssignments: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      const assignments = await fileStorageService.assignments.getAssignments(
        courseName,
        moduleName
      );
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
        await fileStorageService.assignments.updateOrCreateAssignment({
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
        await fileStorageService.assignments.updateOrCreateAssignment({
          courseName,
          moduleName,
          assignmentName,
          assignment,
        });

        if (
          assignment.name !== previousAssignmentName ||
          moduleName !== previousModuleName
        ) {
          await fileStorageService.assignments.delete({
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
      await fileStorageService.assignments.delete({
        courseName,
        moduleName,
        assignmentName,
      });
    }),
});
