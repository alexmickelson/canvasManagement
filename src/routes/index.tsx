import { createFileRoute } from "@tanstack/react-router";
import CourseList from "@/app/CourseList";
import { AddExistingCourseToGlobalSettings } from "@/app/addCourse/AddExistingCourseToGlobalSettings";
import AddCourseToGlobalSettings from "@/app/addCourse/AddNewCourse";
import TodaysLectures from "@/app/todaysLectures/TodaysLectures";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="h-full flex justify-center overflow-auto">
      <div className="xl:w-[900px] mx-auto">
        <br />
        <br />
        <br />
        <br />
        <div className=" flex justify-center">
          <CourseList />
        </div>
        <br />
        <br />
        <TodaysLectures />
        <br />
        <br />
        <AddCourseToGlobalSettings />
        <br />
        <div className="mb-96">
          <AddExistingCourseToGlobalSettings />
        </div>
      </div>
    </main>
  );
}
