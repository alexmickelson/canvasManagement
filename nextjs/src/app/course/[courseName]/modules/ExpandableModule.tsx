"use client";
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
import {
  dateToMarkdownString,
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/models/local/timeUtils";
import { Fragment, useRef, useState } from "react";
import Modal from "../../../../components/Modal";
import NewItemForm from "./NewItemForm";
import { ModuleCanvasStatus } from "./ModuleCanvasStatus";
import ClientOnly from "@/components/ClientOnly";
import ExpandIcon from "../../../../components/icons/ExpandIcon";

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
  const expandRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="bg-slate-800 rounded-lg p-3 border border-slate-600 mb-3">
      <div
        className="font-bold flex flex-row justify-between "
        role="button"
        onClick={() => setExpanded((e) => !e)}
      >
        <div>{moduleName}</div>
        <div className="flex flex-row">
          <ClientOnly>
            <ModuleCanvasStatus moduleName={moduleName} />
          </ClientOnly>
          <ExpandIcon
            style={{
              ...(expanded ? { rotate: "-90deg" } : {}),
            }}
          />
        </div>
      </div>
      <div
        ref={expandRef}
        className={` overflow-hidden transition-all `}
        style={{
          maxHeight: expanded ? expandRef?.current?.scrollHeight : "0",
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
        <div className="grid grid-cols-[auto_1fr]">

        {moduleItems.map(({ type, item }) => {
          const date = getDateFromString(item.dueAt);
          
          return (
            <Fragment key={item.name + type}>
              <div className="text-end text-slate-500 me-2">
                {date && getDateOnlyMarkdownString(date)}
              </div>
              <div className="">{item.name}</div>
            </Fragment>
          );
        })}
        </div>
      </div>
    </div>
  );
}
