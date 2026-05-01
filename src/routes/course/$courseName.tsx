import { createFileRoute, Outlet } from "@tanstack/react-router";
import CourseContextProvider from "@/app/course/[courseName]/context/CourseContextProvider";
import { Suspense } from "react";

export const Route = createFileRoute("/course/$courseName")({
  component: CourseLayout,
});

function CourseLayout() {
  const { courseName } = Route.useParams();
  const decodedCourseName = decodeURIComponent(courseName);
  if (courseName.includes(".js.map")) {
    return <div></div>;
  }
  return (
    <Suspense>
      <CourseContextProvider localCourseName={decodedCourseName}>
        <Outlet />
      </CourseContextProvider>
    </Suspense>
  );
}
