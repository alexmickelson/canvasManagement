import { createFileRoute } from "@tanstack/react-router";
import CourseCalendar from "@/app/course/[courseName]/calendar/CourseCalendar";
import DraggingContextProvider from "@/app/course/[courseName]/context/drag/DraggingContextProvider";
import { CourseNavigation } from "@/app/course/[courseName]/CourseNavigation";
import { DragStyleContextProvider } from "@/app/course/[courseName]/context/drag/dragStyleContext";
import CollapsableSidebar from "@/app/course/[courseName]/CollapsableSidebar";
import { useState } from "react";

export const Route = createFileRoute("/course/$courseName/")({
  component: CoursePage,
});

function CoursePage() {
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  return (
    <div className="h-full flex flex-col">
      <DragStyleContextProvider>
        <DraggingContextProvider>
          <div className="flex sm:flex-row h-full flex-col max-w-[2400px] w-full mx-auto">
            <div className="flex-1 h-full flex flex-col">
              <CourseNavigation
                onShowModules={() => setMobileModulesOpen(true)}
              />
              <CourseCalendar />
            </div>
            <CollapsableSidebar
              mobileOpen={mobileModulesOpen}
              onMobileClose={() => setMobileModulesOpen(false)}
            />
          </div>
        </DraggingContextProvider>
      </DragStyleContextProvider>
    </div>
  );
}
