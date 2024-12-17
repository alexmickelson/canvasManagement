import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { UpdateAssignmentName } from "./UpdateAssignmentName";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";

export default function EditAssignmentHeader({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  return (
    <div className="py-1 flex flex-row justify-start gap-3">
      <Link className="btn btn-thin" href={getCourseUrl(courseName)} shallow={true}>
        {courseName}
      </Link>
      <UpdateAssignmentName
        assignmentName={assignmentName}
        moduleName={moduleName}
      />
      <div>{assignmentName}</div>
    </div>
  );
}
