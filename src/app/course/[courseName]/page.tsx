import CourseCalendar from "./calendar/CourseCalendar";
import CourseSettingsLink from "./CourseSettingsLink";
import ModuleList from "./modules/ModuleList";
import DraggingContextProvider from "./context/drag/DraggingContextProvider";
import { CourseNavigation } from "./CourseNavigation";
import { DragStyleContextProvider } from "./context/drag/dragStyleContext";


export default async function CoursePage({}: {}) {
  return (
    <>
      <div className="h-full flex flex-col">
        <DragStyleContextProvider>
          <DraggingContextProvider>
            <div className="flex sm:flex-row h-full flex-col">
              <div className="flex-1 h-full flex flex-col">
                <CourseNavigation />
                <CourseCalendar />
              </div>
              <div className="w-96 sm:p-3 h-full overflow-y-auto">
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
