"use client";
import { usePagesQueries } from "@/features/local/pages/pageHooks";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import {
  getDateFromStringOrThrow,
  getDateOnlyMarkdownString,
} from "@/features/local/utils/timeUtils";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { getWeekNumber } from "../calendar/calendarMonthUtils";
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
import { useReorderCanvasModuleItemsMutation } from "@/features/canvas/hooks/canvasModuleHooks";
import { useCanvasModulesQuery } from "@/features/canvas/hooks/canvasModuleHooks";
import { Spinner } from "@/components/Spinner";
import { ItemTypeIcon } from "../ItemTypeIcon";

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
      }),
    ),
  });
  const assignments = assignmentsQueries.map((result) => result.data);

  const { data: quizzes } = useQuizzesQueries(moduleName);
  const { data: pages } = usePagesQueries(moduleName);
  const modal = useModal();
  const reorderMutation = useReorderCanvasModuleItemsMutation();
  const { data: canvasModules } = useCanvasModulesQuery();

  const moduleItems: {
    type: "assignment" | "quiz" | "page";
    item: IModuleItem;
  }[] = (assignments ?? [])
    .map(
      (
        a,
      ): {
        type: "assignment" | "quiz" | "page";
        item: IModuleItem;
      } => ({
        type: "assignment",
        item: a,
      }),
    )
    .concat(quizzes.map((q) => ({ type: "quiz", item: q })))
    .concat(pages.map((p) => ({ type: "page", item: p })))
    .sort(
      (a, b) =>
        getDateFromStringOrThrow(
          a.item.dueAt,
          "item due date in expandable module",
        ).getTime() -
        getDateFromStringOrThrow(
          b.item.dueAt,
          "item due date in expandable module",
        ).getTime(),
    );

  const { data: settings } = useLocalCourseSettingsQuery();
  const startDate = getDateFromStringOrThrow(
    settings.startDate,
    "expandable module week grouping",
  );

  const groupedItems = moduleItems.reduce(
    (
      groups: {
        dateKey: string;
        weekLabel: string;
        items: { type: "assignment" | "quiz" | "page"; item: IModuleItem }[];
      }[],
      moduleItem,
    ) => {
      const date = getDateFromStringOrThrow(
        moduleItem.item.dueAt,
        "expandable module item grouping",
      );
      const dateKey = getDateOnlyMarkdownString(date);
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.dateKey === dateKey) {
        return [
          ...groups.slice(0, -1),
          { ...lastGroup, items: [...lastGroup.items, moduleItem] },
        ];
      }
      const weekNum = getWeekNumber(startDate, date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      return [
        ...groups,
        {
          dateKey,
          weekLabel: `Week ${weekNum} - ${dayName}`,
          items: [moduleItem],
        },
      ];
    },
    [],
  );

  return (
    <div
      className="bg-slate-800 rounded-lg border border-slate-600 mb-3 "
      onDrop={(e) => itemDropOnModule(e, moduleName)}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="draggingModule ">
        <div className=" p-3 ">
          <Expandable
            ExpandableElement={({ setIsExpanded, isExpanded }) => (
              <div
                className="font-bold flex flex-row justify-between cursor-pointer "
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
                      ...(isExpanded
                        ? { rotate: "90deg" }
                        : { rotate: "180deg" }),
                    }}
                  />
                </div>
              </div>
            )}
          >
            <>
              {!reorderMutation.isPending && (
                <button
                  className=" me-3"
                  onClick={() => {
                    const canvasModuleId = canvasModules?.find(
                      (m) => m.name === moduleName,
                    )?.id;
                    if (!canvasModuleId) {
                      console.error(
                        "Canvas module ID not found for",
                        moduleName,
                      );
                      return;
                    }
                    reorderMutation.mutate({
                      moduleId: canvasModuleId,
                      items: moduleItems.map((item) => item.item),
                    });
                  }}
                >
                  Sort by Due Date
                </button>
              )}
              {reorderMutation.isPending && <Spinner />}
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
              <div className="flex flex-col">
                {groupedItems.map(({ weekLabel, items }) => (
                  <div key={weekLabel}>
                    <div className="text-slate-500 text-sm mt-1 ps-1">
                      {weekLabel}
                    </div>
                    {items.map(({ type, item }) => (
                      <ExpandableModuleItem
                        key={item.name + type}
                        type={type}
                        item={item}
                        moduleName={moduleName}
                      />
                    ))}
                  </div>
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
  const { setIsDragging } = useDragStyleContext();

  return (
    <div className="flex items-start ps-3">
      <div className="w-6 p-1 flex-none">
        <ItemTypeIcon type={type} />
      </div>
      <Link
        href={getModuleItemUrl(courseName, moduleName, type, item.name)}
        shallow={true}
        className="transition-all hover:text-slate-50 hover:scale-105 ps-1"
        draggable="true"
        onDragStart={(e) => {
          const draggableItem: DraggableItem = {
            type,
            item,
            sourceModuleName: moduleName,
          };
          e.dataTransfer.setData(
            "draggableItem",
            JSON.stringify(draggableItem),
          );
          setIsDragging(true);
        }}
      >
        {item.name}
      </Link>
    </div>
  );
}
