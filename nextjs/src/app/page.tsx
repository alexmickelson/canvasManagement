import CourseList from "./CourseList";
import AddNewCourse from "./newCourse/AddNewCourse";
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
        <AddNewCourse />
      </div>
    </main>
  );
}
