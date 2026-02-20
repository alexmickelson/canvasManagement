"use client";
import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { ReactNode, useCallback, useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import { useTooltip } from "@/components/useTooltip";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import { DraggableItem } from "../../context/drag/draggingContext";
import ClientOnly from "@/components/ClientOnly";
import { useDragStyleContext } from "../../context/drag/dragStyleContext";
import { Tooltip } from "../../../../../components/Tooltip";
import { ContextMenu, ContextMenuItem } from "@/components/ContextMenu";
import {
  useCanvasAssignmentsQuery,
  useUpdateAssignmentInCanvasMutation,
  useDeleteAssignmentFromCanvasMutation,
} from "@/features/canvas/hooks/canvasAssignmentHooks";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { baseCanvasUrl } from "@/features/canvas/services/canvasServiceUtils";
import {
  useDeleteAssignmentMutation,
  useCreateAssignmentMutation,
} from "@/features/local/assignments/assignmentHooks";
import { LocalAssignment } from "@/features/local/assignments/models/localAssignment";
import { useCalendarItemsContext } from "../../context/calendarItemsContext";

function getDuplicateName(name: string, existingNames: string[]): string {
  const match = name.match(/^(.*)\s+(\d+)$/);
  const baseName = match ? match[1] : name;
  const startNum = match ? parseInt(match[2]) + 1 : 2;
  let num = startNum;
  while (existingNames.includes(`${baseName} ${num}`)) {
    num++;
  }
  return `${baseName} ${num}`;
}

function getPreviewContent(
  type: "assignment" | "page" | "quiz",
  item: IModuleItem
): ReactNode {
  if (type === "assignment" && "description" in item) {
    const assignment = item as {
      description: string;
      githubClassroomAssignmentShareLink?: string;
    };
    return (
      <MarkdownDisplay
        markdown={assignment.description}
        replaceText={[
          {
            source: "insert_github_classroom_url",
            destination: assignment.githubClassroomAssignmentShareLink || "",
          },
        ]}
      />
    );
  } else if (type === "page" && "text" in item) {
    return <MarkdownDisplay markdown={item.text as string} />;
  } else if (type === "quiz" && "questions" in item) {
    const quiz = item as { questions: { text: string }[] };
    return quiz.questions.map((q, i: number) => (
      <div key={i} className="">
        <MarkdownDisplay markdown={q.text as string} />
      </div>
    ));
  }
  return null;
}

export function ItemInDay({
  type,
  moduleName,
  status,
  item,
  message,
}: {
  type: "assignment" | "page" | "quiz";
  status: "localOnly" | "incomplete" | "published";
  moduleName: string;
  item: IModuleItem;
  message: ReactNode;
}) {
  const { courseName } = useCourseContext();
  const { setIsDragging } = useDragStyleContext();
  const { visible, targetRef, showTooltip, hideTooltip } = useTooltip(500);

  const [contextMenuPos, setContextMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { data: canvasAssignments } = useCanvasAssignmentsQuery();
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateInCanvas = useUpdateAssignmentInCanvasMutation();
  const deleteFromCanvas = useDeleteAssignmentFromCanvasMutation();
  const deleteLocal = useDeleteAssignmentMutation();
  const createAssignment = useCreateAssignmentMutation();
  const calendarItems = useCalendarItemsContext();

  const assignmentInCanvas =
    type === "assignment"
      ? canvasAssignments?.find((a) => a.name === item.name)
      : undefined;

  const handleContextMenu = (e: React.MouseEvent) => {
    if (type !== "assignment") return;
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setConfirmingDelete(false);
  };

  const closeContextMenu = useCallback(() => {
    setContextMenuPos(null);
    setConfirmingDelete(false);
  }, []);

  const handleDuplicate = useCallback(() => {
    const assignment = item as LocalAssignment;
    const existingNames = Object.values(calendarItems).flatMap((modules) =>
      (modules[moduleName]?.assignments ?? []).map((a) => a.name)
    );
    const newName = getDuplicateName(item.name, existingNames);
    createAssignment.mutate({
      courseName,
      moduleName,
      assignmentName: newName,
      assignment: { ...assignment, name: newName },
    });
    closeContextMenu();
  }, [
    item,
    calendarItems,
    moduleName,
    createAssignment,
    courseName,
    closeContextMenu,
  ]);

  const contextMenuItems: ContextMenuItem[] = confirmingDelete
    ? [
        { label: "Delete from disk?", disabled: true },
        {
          label: "Yes, delete",
          variant: "danger",
          onClick: () => {
            deleteLocal.mutate({ courseName, moduleName, assignmentName: item.name });
            closeContextMenu();
          },
        },
        { label: "Cancel", onClick: closeContextMenu },
      ]
    : [
        ...(assignmentInCanvas
          ? [
              {
                label: "View in Canvas",
                href: `${baseCanvasUrl}/courses/${settings.canvasId}/assignments/${assignmentInCanvas.id}`,
              },
              {
                label: "Update in Canvas",
                onClick: () => {
                  updateInCanvas.mutate({
                    canvasAssignmentId: assignmentInCanvas.id,
                    assignment: item as LocalAssignment,
                  });
                  closeContextMenu();
                },
                disabled: updateInCanvas.isPending,
              },
              {
                label: "Delete from Canvas",
                variant: "danger" as const,
                onClick: () => {
                  deleteFromCanvas.mutate({
                    canvasAssignmentId: assignmentInCanvas.id,
                    assignmentName: item.name,
                  });
                  closeContextMenu();
                },
                disabled: deleteFromCanvas.isPending,
              },
            ]
          : [
              {
                label: "Delete from Disk",
                variant: "danger" as const,
                onClick: () => setConfirmingDelete(true),
              },
            ]),
        { label: "Duplicate", onClick: handleDuplicate },
      ];

  return (
    <div className={" relative group "}>
      <Link
        href={getModuleItemUrl(courseName, moduleName, type, item.name)}
        shallow={true}
        className={
          " border rounded-sm sm:px-1 sm:mx-1 break-words mb-1 truncate sm:text-wrap text-nowrap " +
          " bg-slate-800 " +
          " block " +
          (status === "localOnly" && " text-slate-500 border-slate-600 ") +
          (status === "incomplete" && " border-rose-900 ") +
          (status === "published" && " border-green-800 ")
        }
        role="button"
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
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onContextMenu={handleContextMenu}
        ref={targetRef}
      >
        {item.name}
      </Link>
      <ClientOnly>
        {status === "published" ? (
          getPreviewContent(type, item) && (
            <Tooltip
              message={
                <div className="max-w-md">{getPreviewContent(type, item)}</div>
              }
              targetRef={targetRef}
              visible={visible}
            />
          )
        ) : (
          <Tooltip message={message} targetRef={targetRef} visible={visible} />
        )}
        {contextMenuPos && type === "assignment" && (
          <ContextMenu
            x={contextMenuPos.x}
            y={contextMenuPos.y}
            items={contextMenuItems}
            onClose={closeContextMenu}
          />
        )}
      </ClientOnly>
    </div>
  );
}
