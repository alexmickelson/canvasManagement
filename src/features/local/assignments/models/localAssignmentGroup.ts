import { z } from "zod";

export interface LocalAssignmentGroup {
  canvasId?: number;
  id: string;
  name: string;
  weight: number;
}
export const zodLocalAssignmentGroup = z.object({
  canvasId: z.optional(z.number()).describe("Canvas LMS assignment group ID"),
  id: z.string(),
  name: z.string(),
  weight: z.number().describe("Weight of this group in the overall grade"),
});
