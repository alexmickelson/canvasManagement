import AddNewCourse from "./AddNewCourse";
import CourseList from "./CourseList";

export default async function Home() {
  return (
    <main className="min-h-screen flex justify-center">
      <div>
        <CourseList />
        <br />
        <br />

        <AddNewCourse />
      </div>
    </main>
  );
}
