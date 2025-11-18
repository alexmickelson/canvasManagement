import Modal, { useModal } from "@/components/Modal";
import { getLectureUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "../../context/courseContext";
import NewItemForm from "../../modules/NewItemForm";
import { DraggableItem } from "../../context/drag/draggingContext";
import { useDragStyleContext } from "../../context/drag/dragStyleContext";
import { getLectureForDay } from "@/features/local/utils/lectureUtils";
import { useLecturesSuspenseQuery } from "@/features/local/lectures/lectureHooks";
import ClientOnly from "@/components/ClientOnly";
import { Tooltip } from "@/components/Tooltip";
import { useRef, useState } from "react";

export function DayTitle({ day, dayAsDate }: { day: string; dayAsDate: Date }) {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesSuspenseQuery();
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
        shallow={true}
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
        buttonComponent={({ openModal }) => (
          <svg
            viewBox="0 0 24 24"
            width={22}
            height={22}
            className="cursor-pointer hover:scale-125 hover:stroke-slate-300 stroke-slate-400 transition-all m-0.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={openModal}
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6 12H18M12 6V18"
                className=" "
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        )}
        modalControl={modal}
        modalWidth="w-135"
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
