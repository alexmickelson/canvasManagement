import CourseList from "./CourseList";
import { AddExistingCourseToGlobalSettings } from "./addCourse/AddExistingCourseToGlobalSettings";
import AddCourseToGlobalSettings from "./addCourse/AddNewCourse";
import TodaysLectures from "./todaysLectures/TodaysLectures";

export default async function Home() {
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
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </main>
  );
}
