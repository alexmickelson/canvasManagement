import {
  useAssignmentNamesQuery,
  useAssignmentsQueries,
} from "@/hooks/localCourse/assignmentHooks";
import {
  usePageNamesQuery,
  usePagesQueries,
} from "@/hooks/localCourse/pageHooks";
import {
  useQuizNamesQuery,
  useQuizzesQueries,
} from "@/hooks/localCourse/quizHooks";
import { IModuleItem } from "@/models/local/IModuleItem";
import { getDateFromStringOrThrow } from "@/models/local/timeUtils";
import { useState } from "react";
import Modal from "../../../../components/Modal";
import NewItemForm from "./NewItemForm";

export default function ExpandableModule({
  moduleName,
}: {
  moduleName: string;
}) {
  const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);
  const { data: quizNames } = useQuizNamesQuery(moduleName);
  const { data: pageNames } = usePageNamesQuery(moduleName);

  const { data: assignments } = useAssignmentsQueries(
    moduleName,
    assignmentNames
  );
  const { data: quizzes } = useQuizzesQueries(moduleName, quizNames);
  const { data: pages } = usePagesQueries(moduleName, pageNames);

  const [expanded, setExpanded] = useState(false);

  const moduleItems: {
    type: "assignment" | "quiz" | "page";
    item: IModuleItem;
  }[] = assignments
    .map(
      (
        a
      ): {
        type: "assignment" | "quiz" | "page";
        item: IModuleItem;
      } => ({
        type: "assignment",
        item: a,
      })
    )
    .concat(quizzes.map((q) => ({ type: "quiz", item: q })))
    .concat(pages.map((p) => ({ type: "page", item: p })))
    .sort(
      (a, b) =>
        getDateFromStringOrThrow(
          a.item.dueAt,
          "item due date in expandable module"
        ).getTime() -
        getDateFromStringOrThrow(
          b.item.dueAt,
          "item due date in expandable module"
        ).getTime()
    );

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600 mb-3">
      <div
        className="font-bold "
        role="button"
        onClick={() => setExpanded((e) => !e)}
      >
        {moduleName}
      </div>
      <div
        className={
          ` overflow-hidden ` + (expanded ? " max-h-[30vh]" : " max-h-0")
        }
        style={{
          transition: "max-height 1s cubic-bezier(0, 1, 0, 1)",
        }}
      >
        <Modal buttonText="New Item">
          {({ closeModal }) => (
            <div>
              <NewItemForm moduleName={moduleName} onCreate={closeModal} />
              <br />
              <button onClick={closeModal}>close</button>
            </div>
          )}
        </Modal>
        {moduleItems.map(({ type, item }) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
