import publicProcedure from "../procedures/public";
import { z } from "zod";
import { router } from "../trpc";
import { fileStorageService } from "@/services/fileStorage/fileStorageService";

export const courseItemRouter = router({
  getAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName, assignmentName } }) => {
      return await fileStorageService.assignments.getAssignment(
        courseName,
        moduleName,
        assignmentName
      );
    }),
  getAllAssignments: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
      })
    )
    .query(async ({ input: { courseName, moduleName } }) => {
      return await fileStorageService.assignments.getAssignments(
        courseName,
        moduleName
      );
    }),
});
