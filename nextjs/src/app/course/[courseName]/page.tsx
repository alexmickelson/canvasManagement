import CourseCalendar from "./calendar/CourseCalendar";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import DraggingContextProvider from "./context/DraggingContextProvider";

export default async function CoursePage({}: {}) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row min-h-0">
        <DraggingContextProvider>
          <div className="flex-1 min-h-0">
            <CourseCalendar />
          </div>
          <div className="w-96 p-3">
            <CourseSettingsLink />
            <ModuleList />
          </div>
        </DraggingContextProvider>
      </div>
    </div>
  );
}
