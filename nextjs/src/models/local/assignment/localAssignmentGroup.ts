import { z } from "zod";

export interface LocalAssignmentGroup {
  canvasId?: number;
  id: string;
  name: string;
  weight: number;
}
export const zodLocalAssignmentGroup = z.object({
  canvasId: z.number().optional(), // canvasId is optional
  id: z.string(), // id is a required string
  name: z.string(), // name is a required string
  weight: z.number(), // weight is a required number
});