import { IModuleItem } from "@/features/local/modules/IModuleItem";
import { getModuleItemUrl } from "@/services/urlUtils";
import Link from "next/link";
import { ReactNode } from "react";
import { useCourseContext } from "../../context/courseContext";
import { useTooltip } from "@/components/useTooltip";
import MarkdownDisplay from "@/components/MarkdownDisplay";
import { DraggableItem } from "../../context/drag/draggingContext";
import ClientOnly from "@/components/ClientOnly";
import { useDragStyleContext } from "../../context/drag/dragStyleContext";
import { Tooltip } from "../../../../../components/Tooltip";

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
      </ClientOnly>
    </div>
  );
}
