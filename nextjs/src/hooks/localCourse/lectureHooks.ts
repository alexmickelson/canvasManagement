import { trpc } from "@/services/trpc/utils";

export const useLectureUpdateMutation = () => {
  const utils = trpc.useUtils();
  return trpc.lectures.updateLecture.useMutation({
    onSuccess: () => {
      utils.lectures.getLectures.invalidate();
    },
  });
};
