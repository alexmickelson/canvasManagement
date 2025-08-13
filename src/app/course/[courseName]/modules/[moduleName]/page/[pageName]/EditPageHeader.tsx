import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { UpdatePageName } from "./UpdatePageName";

export default function EditPageHeader({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  return (
    <div className="py-1 flex flex-row justify-start gap-3">
      <Link
        className="btn"
        href={getCourseUrl(courseName)}
        shallow={true}
        prefetch={true}
      >
        {courseName}
      </Link>
      <UpdatePageName pageName={pageName} moduleName={moduleName} />
      <div className="my-auto">{pageName}</div>
    </div>
  );
}
