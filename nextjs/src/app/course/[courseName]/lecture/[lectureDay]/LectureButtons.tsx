"use client";

import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { getCourseUrl } from "@/services/urlUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import { deleteLecture } from "@/services/fileStorage/lectureFileStorageService";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import { lectureKeys } from "@/hooks/localCourse/lectureKeys";

export default function LectureButtons({ lectureDay }: { lectureDay: string }) {
  const queryClient = useQueryClient();
  const { courseName } = useCourseContext();
  const [settings] = useLocalCourseSettingsQuery();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();

  return (
    <div className="p-5 flex flex-row justify-end gap-3">
      <div>
        <Modal
          modalControl={modal}
          buttonText="Delete Lecture"
          buttonClass="btn-danger"
          modalWidth="w-1/5"
        >
          {({ closeModal }) => (
            <div>
              <div className="text-center">
                Are you sure you want to delete this lecture?
              </div>
              <br />
              <div className="flex justify-around gap-3">
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    router.push(getCourseUrl(courseName));
                    await deleteLecture(courseName, settings, lectureDay);
                    await queryClient.invalidateQueries({
                      queryKey: lectureKeys.allLectures(courseName),
                    });
                  }}
                  disabled={isLoading}
                  className="btn-danger"
                >
                  Yes
                </button>
                <button onClick={closeModal} disabled={isLoading}>
                  No
                </button>
              </div>
              {isLoading && <Spinner />}
            </div>
          )}
        </Modal>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}
