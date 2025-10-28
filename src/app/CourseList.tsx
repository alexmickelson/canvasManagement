"use client";
import { Toggle } from "@/components/form/Toggle";
import { useLocalCoursesSettingsQuery } from "@/features/local/course/localCoursesHooks";
import {
  useGlobalSettingsQuery,
  useUpdateGlobalSettingsMutation,
} from "@/features/local/globalSettings/globalSettingsHooks";
import {
  getDateKey,
  getTermName,
  groupByStartDate,
} from "@/features/local/utils/timeUtils";
import { getCourseUrl } from "@/services/urlUtils";
import Link from "next/link";
import { useState } from "react";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";

export default function CourseList() {
  const { data: allSettings } = useLocalCoursesSettingsQuery();
  const [isDeleting, setIsDeleting] = useState(false);

  const coursesByStartDate = groupByStartDate(allSettings);

  const sortedDates = Object.keys(coursesByStartDate).sort();

  return (
    <div>
      <Toggle
        label={"Delete Mode"}
        value={isDeleting}
        onChange={(set) => setIsDeleting(set)}
      />
      <div className="flex flex-row ">
        {sortedDates.map((startDate) => (
          <div
            key={startDate}
            className=" border-4 border-slate-800 rounded p-3 m-3"
          >
            <div className="text-center">{getTermName(startDate)}</div>
            {coursesByStartDate[getDateKey(startDate)].map((settings) => (
              <CourseItem
                key={settings.name}
                courseName={settings.name}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseItem({
  courseName,
  isDeleting,
}: {
  courseName: string;
  isDeleting: boolean;
}) {
  const { data: globalSettings } = useGlobalSettingsQuery();
  const updateSettingsMutation = useUpdateGlobalSettingsMutation();
  const modal = useModal();

  return (
    <div className="flex items-center justify-start gap-2">
      {isDeleting && (
        <Modal
          modalControl={modal}
          buttonText="X"
          buttonClass="
            unstyled
            text-red-200 hover:text-red-400 
            bg-red-950/50 hover:bg-red-950/70
            transition-all hover:scale-110
            mb-3
          "
          modalWidth="w-1/3"
        >
          {({ closeModal }) => (
            <div>
              <div className="text-center">
                Are you sure you want to remove {courseName} from global
                settings?
              </div>
              <br />
              <div className="flex justify-around gap-3">
                <button
                  onClick={async () => {
                    await updateSettingsMutation.mutateAsync({
                      globalSettings: {
                        ...globalSettings,
                        courses: globalSettings.courses.filter(
                          (course) => course.name !== courseName
                        ),
                      },
                    });
                    closeModal();
                  }}
                  disabled={updateSettingsMutation.isPending}
                  className="btn-danger"
                >
                  Yes
                </button>
                <button
                  onClick={closeModal}
                  disabled={updateSettingsMutation.isPending}
                >
                  No
                </button>
              </div>
              {updateSettingsMutation.isPending && <Spinner />}
            </div>
          )}
        </Modal>
      )}
      <Link
        href={getCourseUrl(courseName)}
        shallow={true}
        prefetch={true}
        className="
          font-bold text-xl block
          transition-all hover:scale-105 hover:underline hover:text-slate-200
          mb-3
        "
      >
        {courseName}
      </Link>
    </div>
  );
}
