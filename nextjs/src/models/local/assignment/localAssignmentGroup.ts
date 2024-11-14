import { z } from "zod";

export interface LocalAssignmentGroup {
  canvasId?: number;
  id: string;
  name: string;
  weight: number;
}
export const zodLocalAssignmentGroup = z.object({
  canvasId: z.optional(z.number()),
  id: z.string(),
  name: z.string(),
  weight: z.number(),
});
