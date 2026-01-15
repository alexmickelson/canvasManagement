import { BreadCrumbs } from "@/components/BreadCrumbs";
import { UpdateAssignmentName } from "./UpdateAssignmentName";
import { RightSingleChevron } from "@/components/icons/RightSingleChevron";

export default function EditAssignmentHeader({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  return (
    <div className="py-1 flex flex-row justify-between">
      <div className="flex flex-row">
        <BreadCrumbs />
        <span className="text-slate-500 cursor-default select-none my-auto">
          <RightSingleChevron />
        </span>
        <div className="my-auto px-3">{assignmentName}</div>
      </div>
      <div  className="px-1">
        <UpdateAssignmentName
          assignmentName={assignmentName}
          moduleName={moduleName}
        />
      </div>
    </div>
  );
}
