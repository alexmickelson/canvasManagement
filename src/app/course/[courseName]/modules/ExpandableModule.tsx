"use client";
import { usePagesQueries } from "@/features/local/pages/pageHooks";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import {
  getDateFromString,
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";
import { Fragment } from "react";
import Modal, { useModal } from "../../../../components/Modal";
import NewItemForm from "./NewItemForm";
import { ModuleCanvasStatus } from "./ModuleCanvasStatus";
import ClientOnly from "@/components/ClientOnly";
import ExpandIcon from "../../../../components/icons/ExpandIcon";
import {
  DraggableItem,
  useDraggingContext,
} from "../context/drag/draggingContext";
import Link from "next/link";
import { getModuleItemUrl } from "@/services/urlUtils";
import { useCourseContext } from "../context/courseContext";
import { Expandable } from "../../../../components/Expandable";
import { useDragStyleContext } from "../context/drag/dragStyleContext";
import { useQuizzesQueries } from "@/features/local/quizzes/quizHooks";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useAssignmentNamesQuery } from "@/features/local/assignments/assignmentHooks";

export default function ExpandableModule({
  moduleName,
}: {
  moduleName: string;
}) {
  const trpc = useTRPC();
  const { itemDropOnModule } = useDraggingContext();
  const { courseName } = useCourseContext();
  const { data: assignmentNames } = useAssignmentNamesQuery(moduleName);

  const assignmentsQueries = useSuspenseQueries({
    queries: assignmentNames.map((assignmentName) =>
      trpc.assignment.getAssignment.queryOptions({
        courseName,
        moduleName,
        assignmentName,
      })
    ),
  });
  const assignments = assignmentsQueries.map((result) => result.data);

  const { data: quizzes } = useQuizzesQueries(moduleName);
  const { data: pages } = usePagesQueries(moduleName);
  const modal = useModal();

  const moduleItems: {
    type: "assignment" | "quiz" | "page";
    item: IModuleItem;
  }[] = (assignments ?? [])
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
    <div
      className="bg-slate-800 rounded-lg border border-slate-600 mb-3"
      onDrop={(e) => itemDropOnModule(e, moduleName)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="draggingModule ">
        <div className=" p-3 ">
          <Expandable
            ExpandableElement={({ setIsExpanded, isExpanded }) => (
              <div
                className="font-bold flex flex-row justify-between "
                role="button"
                onClick={() => setIsExpanded((e) => !e)}
              >
                <div className="flex-1">{moduleName}</div>
                <div className=" flex flex-row justify-end">
                  <ClientOnly>
                    <ModuleCanvasStatus moduleName={moduleName} />
                  </ClientOnly>
                  <ExpandIcon
                    style={{
                      ...(isExpanded ? { rotate: "-90deg" } : {}),
                    }}
                  />
                </div>
              </div>
            )}
          >
            <>
              <Modal
                modalControl={modal}
                buttonText="New Item"
                modalWidth="w-135"
              >
                {({ closeModal }) => (
                  <div>
                    <NewItemForm
                      moduleName={moduleName}
                      onCreate={closeModal}
                    />
                    <br />
                    <button onClick={closeModal}>close</button>
                  </div>
                )}
              </Modal>
              <div className="grid grid-cols-[auto_1fr]">
                {moduleItems.map(({ type, item }) => (
                  <ExpandableModuleItem
                    key={item.name + type}
                    type={type}
                    item={item}
                    moduleName={moduleName}
                  />
                ))}
              </div>
            </>
          </Expandable>
        </div>
      </div>
    </div>
  );
}

function ExpandableModuleItem({
  type,
  item,
  moduleName,
}: {
  type: "assignment" | "quiz" | "page";
  item: IModuleItem;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const date = getDateFromString(item.dueAt);
  const { setIsDragging } = useDragStyleContext();

  return (
    <Fragment key={item.name + type}>
      <div className="text-end text-slate-500 me-2">
        {date && getDateOnlyMarkdownString(date)}
      </div>
      <Link
        href={getModuleItemUrl(courseName, moduleName, type, item.name)}
        shallow={true}
        className="transition-all hover:text-slate-50 hover:scale-105"
        draggable="true"
        onDragStart={(e) => {
          const draggableItem: DraggableItem = {
            type,
            item,
            sourceModuleName: moduleName,
          };
          e.dataTransfer.setData(
            "draggableItem",
            JSON.stringify(draggableItem)
          );
          setIsDragging(true);
        }}
      >
        {item.name}
      </Link>
    </Fragment>
  );
}
