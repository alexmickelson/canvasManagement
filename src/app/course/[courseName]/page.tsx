import CourseCalendar from "./calendar/CourseCalendar";
import DraggingContextProvider from "./context/drag/DraggingContextProvider";
import { CourseNavigation } from "./CourseNavigation";
import { DragStyleContextProvider } from "./context/drag/dragStyleContext";
import CollapsableSidebar from "./CollapsableSidebar";


export default async function CoursePage() {
  return (
    <>
      <div className="h-full flex flex-col">
        <DragStyleContextProvider>
          <DraggingContextProvider>
            <div className="flex sm:flex-row h-full flex-col max-w-[2400px] mx-auto">
              <div className="flex-1 h-full flex flex-col">
                <CourseNavigation />
                <CourseCalendar />
              </div>
              <CollapsableSidebar />
            </div>
          </DraggingContextProvider>
        </DragStyleContextProvider>
      </div>
    </>
  );
}
