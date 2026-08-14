"use client";
import { useGlobalSettingsQuery } from "@/features/local/globalSettings/globalSettingsHooks";
import { whyCourseNamesMustBeUnique } from "@/features/local/globalSettings/globalSettingsUtils";
import { GlobalSettingsCourse } from "@/features/local/globalSettings/globalSettingsModels";

/**
 * The name is compared exactly the way the course lookup compares it, so this
 * warning shows up for exactly the names the server would reject.
 */
export const useCourseWithSameName = (
  name: string
): GlobalSettingsCourse | undefined => {
  const { data: globalSettings } = useGlobalSettingsQuery();

  if (!name) return undefined;
  return globalSettings.courses.find((course) => course.name === name);
};

export const DuplicateCourseNameWarning = ({ name }: { name: string }) => {
  const existingCourse = useCourseWithSameName(name);

  if (!existingCourse) return undefined;

  return (
    <div className="text-red-300 px-5 py-3">
      <div className="font-bold">
        There is already a course named &quot;{existingCourse.name}&quot;, in{" "}
        {existingCourse.path}
      </div>
      <div className="pt-1">{whyCourseNamesMustBeUnique}</div>
      <div className="pt-1">Pick a different name for this course.</div>
    </div>
  );
};
