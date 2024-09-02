import CourseContextProvider from "./context/CourseContextProvider";
import CourseCalendar from "./calendar/CourseCalendar";
import CourseSettings from "./CourseSettings";
import ModuleList from "./modules/ModuleList";
import DraggingContextProvider from "./context/DraggingContextProvider";

export default async function CoursePage({
  params: { courseName },
}: {
  params: { courseName: string };
}) {
  return (
    <CourseContextProvider localCourseName={courseName}>
      <div className="h-full flex flex-col">
        <CourseSettings />
        <div className="flex flex-row min-h-0">
          <DraggingContextProvider localCourseName={courseName}>
            <div className="flex-1 min-h-0">
              <CourseCalendar />
            </div>
            <div className="w-96 p-3">
              <ModuleList />
            </div>
          </DraggingContextProvider>
        </div>
      </div>
    </CourseContextProvider>
  );
}
