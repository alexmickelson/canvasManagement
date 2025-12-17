import z from "zod";

export const zodGlobalSettingsCourse = z.object({
  path: z.string(),
  name: z.string(),
});

export const zodGlobalSettings = z.object({
  courses: z.array(zodGlobalSettingsCourse),
  options: z.record(z.any()).optional(),
});


export type GlobalSettings = z.infer<typeof zodGlobalSettings>;
export type GlobalSettingsCourse = z.infer<typeof zodGlobalSettingsCourse>;