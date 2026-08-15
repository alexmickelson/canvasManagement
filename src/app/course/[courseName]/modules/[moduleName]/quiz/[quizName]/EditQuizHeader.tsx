import { RightSingleChevron } from "@/components/icons/RightSingleChevron";
import { BreadCrumbs } from "@/components/BreadCrumbs";

export default function EditQuizHeader({ quizName }: { quizName: string }) {
  return (
    <div className="flex flex-row items-center min-w-0">
      <BreadCrumbs />
      <span className="text-slate-500 cursor-default select-none my-auto">
        <RightSingleChevron />
      </span>
      <div className="my-auto px-3 truncate min-w-10 flex-auto">{quizName}</div>
    </div>
  );
}
