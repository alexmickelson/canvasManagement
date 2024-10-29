import CourseList from "./CourseList";
import AddNewCourse from "./newCourse/AddNewCourse";

export default async function Home() {
  return (
    <main className="h-full flex justify-center overflow-auto">
      <div>
        <CourseList />
        <br />
        <br />
        <AddNewCourse />
      </div>
    </main>
  );
}
