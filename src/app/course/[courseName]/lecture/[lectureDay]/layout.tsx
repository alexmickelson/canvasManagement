import { Suspense } from "react";
import CourseContextProvider from "../../context/CourseContextProvider";
import { Metadata } from "next";
import { getTitle } from "@/services/titleUtils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseName: string; lectureDay: string }>;
}): Promise<Metadata> {
  const { courseName, lectureDay } = await params;
  const decodedDay = decodeURIComponent(lectureDay);
  const dayOnly = decodedDay.split(" ")[0];
  return {
    title: getTitle(`${courseName} lecture ${dayOnly}`),
  };
}

export default async function LectureLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseName: string; lectureDay: string }>;
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
