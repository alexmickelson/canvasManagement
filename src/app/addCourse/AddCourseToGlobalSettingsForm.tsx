"use client";
import ButtonSelect from "@/components/ButtonSelect";
import { DayOfWeekInput } from "@/components/form/DayOfWeekInput";
import SelectInput from "@/components/form/SelectInput";
import { StoragePathSelector } from "@/components/form/StoragePathSelector";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import { SuspenseAndErrorHandling } from "@/components/SuspenseAndErrorHandling";
import {
  useCreateLocalCourseMutation,
  useLocalCoursesSettingsQuery,
} from "@/features/local/course/localCoursesHooks";
import { CanvasCourseModel } from "@/features/canvas/models/courses/canvasCourseModel";
import { CanvasEnrollmentTermModel } from "@/features/canvas/models/enrollmentTerms/canvasEnrollmentTermModel";
import { AssignmentSubmissionType } from "@/features/local/assignments/models/assignmentSubmissionType";
import { getCourseUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  DayOfWeek,
  LocalCourseSettings,
} from "@/features/local/course/localCourseSettings";
import { useCourseListInTermQuery } from "@/features/canvas/hooks/canvasCourseHooks";
import { useCanvasTermsQuery } from "@/features/canvas/hooks/canvasHooks";

const sampleCompose = `services:
  canvas_manager:
    image: alexmickelson/canvas_management:2 # pull this image regularly
    user: 1000:1000 # userid:groupid that matches file ownership on host system (probably leave like this)
    ports:
      - 8080:3000 # hostPort:containerPort - you can change the host port if you like
    env_file:
      - .env # needs to have your CANVAS_TOKEN set
    environment:
      - TZ=America/Denver # prevents timezone issues for due dates
      # - FILE_POLLING=true # increases cpu usage, uncomment if source volumes are on ntfs
    volumes:
      - ~/projects/faculty/1430/2024-fall-alex/modules:/app/storage/UX
      - ~/projects/faculty/4850_AdvancedFE/2024-fall-alex/modules:/app/storage/advanced_frontend
`;

export default function AddNewCourseToGlobalSettingsForm() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const { data: canvasTerms } = useCanvasTermsQuery(today);
  const [selectedTerm, setSelectedTerm] = useState<
    CanvasEnrollmentTermModel | undefined
  >();
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<DayOfWeek[]>([]);
  const [selectedCanvasCourse, setSelectedCanvasCourse] = useState<
    CanvasCourseModel | undefined
  >();
  const [selectedDirectory, setSelectedDirectory] = useState<
    string | undefined
  >();
  const [courseToImport, setCourseToImport] = useState<
    LocalCourseSettings | undefined
  >();
  const [name, setName] = useState("");
  const createCourse = useCreateLocalCourseMutation();

  const formIsComplete =
    selectedTerm && selectedCanvasCourse && selectedDirectory;


  return (
    <div>
      <ButtonSelect
        options={canvasTerms}
        getOptionName={(t) => t?.name ?? ""}
        setValue={setSelectedTerm}
        value={selectedTerm}
        label={"Canvas Term"}
        center={true}
      />
      <SuspenseAndErrorHandling>
        {selectedTerm && (
          <OtherSettings
            selectedTerm={selectedTerm}
            selectedCanvasCourse={selectedCanvasCourse}
            setSelectedCanvasCourse={setSelectedCanvasCourse}
            selectedDirectory={selectedDirectory}
            setSelectedDirectory={setSelectedDirectory}
            selectedDaysOfWeek={selectedDaysOfWeek}
            setSelectedDaysOfWeek={setSelectedDaysOfWeek}
            courseToImport={courseToImport}
            setCourseToImport={setCourseToImport}
            name={name}
            setName={setName}
          />
        )}
      </SuspenseAndErrorHandling>
      <div className="m-3 text-center">
        <button
          disabled={!formIsComplete || createCourse.isPending}
          onClick={async () => {
            if (formIsComplete) {
              console.log("Creating course with settings:", selectedDirectory, "old course", courseToImport);
              const newSettings: LocalCourseSettings = courseToImport
                ? {
                    ...courseToImport,
                    name: name,
                    daysOfWeek: selectedDaysOfWeek,
                    canvasId: selectedCanvasCourse.id,
                    startDate: selectedTerm.start_at ?? "",
                    endDate: selectedTerm.end_at ?? "",
                    holidays: [],
                    assignmentGroups: courseToImport.assignmentGroups.map(
                      (assignmentGroup) => {
                        const { canvasId: _, ...groupWithoutCanvas } =
                          assignmentGroup;
                        return { ...groupWithoutCanvas, canvasId: undefined };
                      }
                    ),
                    assets: [],
                  }
                : {
                    name: name,
                    assignmentGroups: [],
                    daysOfWeek: selectedDaysOfWeek,
                    canvasId: selectedCanvasCourse.id,
                    startDate: selectedTerm.start_at ?? "",
                    endDate: selectedTerm.end_at ?? "",
                    defaultDueTime: { hour: 23, minute: 59 },
                    defaultAssignmentSubmissionTypes: [
                      AssignmentSubmissionType.ONLINE_TEXT_ENTRY,
                      AssignmentSubmissionType.ONLINE_UPLOAD,
                    ],
                    defaultFileUploadTypes: ["pdf", "png", "jpg", "jpeg"],
                    defaultLockHoursOffset: 0,
                    holidays: [],
                    assets: [],
                  };
              await createCourse.mutateAsync({
                settings: newSettings,
                settingsFromCourseToImport: courseToImport,
                name,
                directory: selectedDirectory,
              });
              router.push(getCourseUrl(name));
            }
          }}
        >
          Save New Course Configuration
        </button>
      </div>
      {createCourse.isPending && <Spinner />}

      {/* <pre>
        <div>Example docker compose</div>
        <code className="language-yml">{sampleCompose}</code>
      </pre> */}
    </div>
  );
}

function OtherSettings({
  selectedTerm,
  selectedCanvasCourse,
  setSelectedCanvasCourse,
  selectedDirectory: _,
  setSelectedDirectory,
  selectedDaysOfWeek,
  setSelectedDaysOfWeek,
  courseToImport,
  setCourseToImport,
  name,
  setName,
}: {
  selectedTerm: CanvasEnrollmentTermModel;
  selectedCanvasCourse: CanvasCourseModel | undefined;
  setSelectedCanvasCourse: Dispatch<
    SetStateAction<CanvasCourseModel | undefined>
  >;
  selectedDirectory: string | undefined;
  setSelectedDirectory: Dispatch<SetStateAction<string | undefined>>;
  selectedDaysOfWeek: DayOfWeek[];
  setSelectedDaysOfWeek: Dispatch<SetStateAction<DayOfWeek[]>>;
  courseToImport: LocalCourseSettings | undefined;
  setCourseToImport: Dispatch<SetStateAction<LocalCourseSettings | undefined>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
}) {
  const { data: canvasCourses, isLoading: canvasCoursesLoading } =
    useCourseListInTermQuery(selectedTerm.id);
  const { data: allSettings } = useLocalCoursesSettingsQuery();
  const [directory, setDirectory] = useState("./");

  const populatedCanvasCourseIds = allSettings?.map((s) => s.canvasId) ?? [];
  const availableCourses =
    canvasCourses?.filter(
      (canvas: CanvasCourseModel) =>
        !populatedCanvasCourseIds.includes(canvas.id)
    ) ?? [];

  return (
    <>
      <ButtonSelect
        value={selectedCanvasCourse}
        setValue={setSelectedCanvasCourse}
        label={"Course"}
        options={availableCourses}
        getOptionName={(c) => c?.name ?? ""}
        center={true}
      />
      {canvasCoursesLoading && <Spinner />}
      {!canvasCoursesLoading && availableCourses.length === 0 && (
        <div className="text-center text-red-300">
          <div className="flex justify-center ">
            <div className="text-left">
              No available courses in this term to add. Either
              <ol>
                <li>all courses have already been added, or</li>
                <li>there are no courses in this term</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      <StoragePathSelector
        value={directory}
        setValue={setDirectory}
        setLastTypedValue={setSelectedDirectory}
        label={"Storage Folder"}
      />
      <br />
      <div className="flex justify-center">
        <DayOfWeekInput
          selectedDays={selectedDaysOfWeek}
          updateSettings={(day) => {
            setSelectedDaysOfWeek((oldDays) => {
              const hasDay = oldDays.includes(day);

              return hasDay
                ? oldDays.filter((d) => d !== day)
                : [day, ...oldDays];
            });
          }}
        />
      </div>
      <SelectInput
        value={courseToImport}
        setValue={setCourseToImport}
        label={"(Optional) Course Content to Import"}
        options={allSettings}
        getOptionName={(c) => c.name}
      />
      <TextInput value={name} setValue={setName} label={"Display Name"} />
      <div className="px-5">
        Assignments, Quizzes, Pages, and Lectures will have their due dates
        moved based on how far they are from the start of the semester.
        <br />
        You will still need to go through and re-order the course content, but
        things will be within a few days of where they should be.
      </div>
    </>
  );
}
