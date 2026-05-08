import z from "zod";

export const zodGlobalSettingsCourse = z.object({
  path: z.string().describe("File system path to the course directory"),
  name: z.string(),
});

export const zodGlobalSettings = z.object({
  courses: z.array(zodGlobalSettingsCourse),
  feedbackDelims: z
    .record(z.string(), z.string())
    .optional()
    .describe("Custom feedback delimiters keyed by identifier"),
});

export type GlobalSettings = z.infer<typeof zodGlobalSettings>;
export type GlobalSettingsCourse = z.infer<typeof zodGlobalSettingsCourse>;
