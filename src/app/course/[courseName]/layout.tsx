import { Suspense } from "react";
import CourseContextProvider from "./context/CourseContextProvider";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseName: string }>;
}) {
  const { courseName } = await params;
  const decodedCourseName = decodeURIComponent(courseName);
  if (courseName.includes(".js.map")) {
    console.log("cannot load course that is .js.map " + decodedCourseName);
    return <div></div>;
  }
  return (
    <Suspense>
      <CourseContextProvider localCourseName={decodedCourseName}>
        {children}
      </CourseContextProvider>
    </Suspense>
  );
}
