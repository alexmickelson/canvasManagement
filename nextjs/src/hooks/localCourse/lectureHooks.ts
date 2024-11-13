import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { trpc } from "@/services/trpc/utils";

export const useLecturesSuspenseQuery = () => {
  const { courseName } = useCourseContext();
  return trpc.lectures.getLectures.useSuspenseQuery({ courseName });
};

export const useLectureUpdateMutation = () => {
  const utils = trpc.useUtils();
  return trpc.lectures.updateLecture.useMutation({
    onSuccess: () => {
      utils.lectures.getLectures.invalidate();
    },
  });
};

export const useDeleteLectureMutation = () => {
  const utils = trpc.useUtils();
  return trpc.lectures.deleteLecture.useMutation({
    onSuccess: () => {
      utils.lectures.getLectures.invalidate();
    },
  });
};
