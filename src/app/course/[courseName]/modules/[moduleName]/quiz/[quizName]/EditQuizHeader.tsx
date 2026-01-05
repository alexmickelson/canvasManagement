import { RightSingleChevron } from "@/components/icons/RightSingleChevron";
import { UpdateQuizName } from "./UpdateQuizName";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function EditQuizHeader({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  return (
    <div className="py-1 flex flex-row justify-between">
      <div className="flex flex-row">
        <BreadCrumbs />
        <span className="text-slate-500 cursor-default select-none my-auto">
          <RightSingleChevron />
        </span>
        <div className="my-auto px-3">{quizName}</div>
      </div>
      <div className="px-1">
        <UpdateQuizName quizName={quizName} moduleName={moduleName} />
      </div>
    </div>
  );
}
