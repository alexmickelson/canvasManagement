import { z } from "zod";

export interface Lecture {
  name: string
  date: string
  content: string 
}

export const zodLecture = z.object({
  name: z.string(),
  date: z.string(), 
  content: z.string(),
});
