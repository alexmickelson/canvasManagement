"use client";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { settingsBox } from "./sharedSettings";
import { useCourseStudentsQuery } from "@/hooks/canvas/canvasCourseHooks";
import { Spinner } from "@/components/Spinner";

export default function GithubClassroomList() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const enrollmentsQuery = useCourseStudentsQuery(settings.canvasId);

  if (enrollmentsQuery.isLoading)
    return (
      <div className={settingsBox}>
        <Spinner />
      </div>
    );
  return (
    <div className={settingsBox}>
      <h5 className="text-center">Github Classroom Friendly Roster</h5>
      <p className="text-center text-slate-500">
        Copy and paste this into github classroom to import students
      </p>

      <pre>
        <code>
          {enrollmentsQuery.data?.map((student) => student.email + "\n")}
        </code>
      </pre>
    </div>
  );
}
