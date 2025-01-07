import Modal, { useModal } from "@/components/Modal";
import { getLectureUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "../../context/courseContext";
import NewItemForm from "../../modules/NewItemForm";
import { DraggableItem } from "../../context/drag/draggingContext";
import { useDragStyleContext } from "../../context/drag/dragStyleContext";
import { getLectureForDay } from "@/models/local/utils/lectureUtils";
import { useLecturesSuspenseQuery } from "@/hooks/localCourse/lectureHooks";
import ClientOnly from "@/components/ClientOnly";
import { Tooltip } from "@/components/Tooltip";
import { useRef, useState } from "react";

export function DayTitle({ day, dayAsDate }: { day: string; dayAsDate: Date }) {
  const { courseName } = useCourseContext();
  const [weeks] = useLecturesSuspenseQuery();
  const { setIsDragging } = useDragStyleContext();
  const todaysLecture = getLectureForDay(weeks, dayAsDate);
  const modal = useModal();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const lectureName = todaysLecture && (todaysLecture.name || "lecture");

  return (
    <div className="flex justify-between">
      <Link
        className="ms-1 me-1 truncate text-nowrap transition-all hover:font-bold hover:text-slate-300"
        href={getLectureUrl(courseName, day)}
        prefetch={false}
        draggable={true}
        onDragStart={(e) => {
          if (todaysLecture) {
            const draggableItem: DraggableItem = {
              type: "lecture",
              item: { ...todaysLecture, dueAt: todaysLecture.date },
              sourceModuleName: undefined,
            };
            e.dataTransfer.setData(
              "draggableItem",
              JSON.stringify(draggableItem)
            );
            setIsDragging(true);
          }
        }}
        ref={linkRef}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {dayAsDate.getDate()} {lectureName}
      </Link>
      <ClientOnly>
        {(lectureName?.length ?? 0) > 0 && (
          <Tooltip
            message={
              <div>
                {lectureName}
                {todaysLecture?.content && (
                  <>
                    <pre>
                      <code>{todaysLecture?.content}</code>
                    </pre>
                  </>
                )}
              </div>
            }
            targetRef={linkRef}
            visible={tooltipVisible}
          />
        )}
      </ClientOnly>
      <Modal
        modalControl={modal}
        buttonText="+"
        buttonClass="unstyled hover:font-bold hover:scale-125 px-1 mb-auto mt-0 pt-0"
      >
        {({ closeModal }) => (
          <div>
            <NewItemForm creationDate={day} onCreate={closeModal} />
            <br />
            <button onClick={closeModal}>close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
