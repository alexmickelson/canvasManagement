"use client";

import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import { getCourseUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCourseContext } from "../../context/courseContext";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import { useDeleteLectureMutation } from "@/features/local/lectures/lectureHooks";
import Link from "next/link";
import { useItemNavigation } from "../../hooks/useItemNavigation";
import ItemNavigationButtons from "../../components/ItemNavigationButtons";

export default function LectureButtons({ lectureDay }: { lectureDay: string }) {
  const { courseName } = useCourseContext();
  const { data: settings } = useLocalCourseSettingsQuery();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const modal = useModal();
  const deleteLecture = useDeleteLectureMutation();
  const { previousUrl, nextUrl } = useItemNavigation("lecture", lectureDay);

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
                    await deleteLecture.mutateAsync({
                      courseName,
                      settings,
                      lectureDay,
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
      </div>
      <Link className="btn" href={getCourseUrl(courseName)} shallow={true}>
        Go Back
      </Link>
      <ItemNavigationButtons previousUrl={previousUrl} nextUrl={nextUrl} />
      {isLoading && <Spinner />}
    </div>
  );
}
