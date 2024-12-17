import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { UpdateQuizName } from "./UpdateQuizName";

export default function EditQuizHeader({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  return (
    <div className="py-1 flex flex-row justify-start gap-3">
      <Link
        className="btn btn-thin"
        href={getCourseUrl(courseName)}
        shallow={true}
      >
        {courseName}
      </Link>
      <UpdateQuizName quizName={quizName} moduleName={moduleName} />
      <div>{quizName}</div>
    </div>
  );
}
