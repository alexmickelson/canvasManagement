import CourseCalendar from "./calendar/CourseCalendar";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import DraggingContextProvider from "./context/DraggingContextProvider";
import CourseTitle from "./CourseTitle";
import { CourseNavigation } from "./CourseNavigation";
import { DragStyleContextProvider } from "./context/dragStyleContext";

export default async function CoursePage({}: {}) {
  return (
    <>
      <CourseTitle />
      <div className="h-full flex flex-col">
        <DragStyleContextProvider>
          <DraggingContextProvider>
            <div className="flex flex-row h-full">
              <div className="flex-1 h-full flex flex-col">
                <CourseNavigation />
                <CourseCalendar />
              </div>
              <div className="w-96 p-3 h-full overflow-y-auto">
                <CourseSettingsLink />
                <ModuleList />
              </div>
            </div>
          </DraggingContextProvider>
        </DragStyleContextProvider>
      </div>
    </>
  );
}
