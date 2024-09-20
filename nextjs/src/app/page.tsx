import CourseList from "./CourseList";
import AddNewCourse from "./newCourse/AddNewCourse";

export default async function Home() {
  return (
    <main className="min-h-0 flex justify-center">
      <div>
        <CourseList />
        <br />
        <br />
        <AddNewCourse />
      </div>
    </main>
  );
}
