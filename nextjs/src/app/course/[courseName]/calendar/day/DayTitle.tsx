import Modal, { useModal } from "@/components/Modal";
import { useLecturesByWeekQuery } from "@/hooks/localCourse/lectureHooks";
import { getLectureUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useCourseContext } from "../../context/courseContext";
import NewItemForm from "../../modules/NewItemForm";
import { DraggableItem } from "../../context/draggingContext";
import { useDragStyleContext } from "../../context/dragStyleContext";
import { getLectureForDay } from "@/models/local/lectureUtils";

export function DayTitle({ day, dayAsDate }: { day: string; dayAsDate: Date }) {
  const { courseName } = useCourseContext();
  const { data: weeks } = useLecturesByWeekQuery();
  const { setIsDragging } = useDragStyleContext();
  const todaysLecture = getLectureForDay(weeks, dayAsDate);
  const modal = useModal();

  return (
    <div className="flex justify-between">
      <Link
        className="ms-1 me-1 truncate text-nowrap transition-all hover:font-bold hover:text-slate-300"
        href={getLectureUrl(courseName, day)}
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
      >
        {dayAsDate.getDate()} {todaysLecture?.name}
      </Link>
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
