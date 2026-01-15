import { UpdatePageName } from "./UpdatePageName";
import { BreadCrumbs } from "@/components/BreadCrumbs";
import { RightSingleChevron } from "@/components/icons/RightSingleChevron";

export default function EditPageHeader({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  return (
    <div className="py-1 flex flex-row justify-between">
      <div className="flex flex-row">
        <BreadCrumbs />
        <span className="text-slate-500 cursor-default select-none my-auto">
          <RightSingleChevron />
        </span>
        <div className="my-auto px-3">{pageName}</div>
      </div>
      <div className="px-1">
        <UpdatePageName pageName={pageName} moduleName={moduleName} />
      </div>
    </div>
  );
}
