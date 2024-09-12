import { DayOfWeekInput } from "@/components/form/DayOfWeekInput";
import SelectInput from "@/components/form/SelectInput";
import { useCourseListInTermQuery } from "@/hooks/canvas/canvasCourseHooks";
import { useCanvasTermsQuery } from "@/hooks/canvas/canvasHooks";
import { useEmptyDirectoriesQuery } from "@/hooks/localCourse/storageDirectoryHooks";
import { CanvasCourseModel } from "@/models/canvas/courses/canvasCourseModel";
import { CanvasEnrollmentTermModel } from "@/models/canvas/enrollmentTerms/canvasEnrollmentTermModel";
import { DayOfWeek } from "@/models/local/localCourse";
import React, { useMemo, useState } from "react";

const sampleCompose = `
services:
  canvas_manager:
    image: alexmickelson/canvas_management:2
    user: 1000:1000 # userid:groupid that matches file ownership on host system
    ports:
      - 8080:8080 # hostPort:containerPort - you can change the first one if you like
    env_file:
      - .env # needs to have your CANVAS_TOKEN set
    environment:
      - storageDirectory=/app/storage
      - TZ=America/Denver
    volumes:
      - ~/projects/faculty/1430/2024-fall-alex/modules:/app/storage/UX
      - ~/projects/faculty/4850_AdvancedFE/2024-fall-alex/modules:/app/storage/advanced_frontend
      - ~/projects/faculty/1810/2024-fall-alex/modules:/app/storage/intro_to_web
      - ~/projects/faculty/1420/2024-fall/Modules:/app/storage/1420
      - ~/projects/faculty/1425/2024-fall/Modules:/app/storage/1425
`

export default function NewCourseForm() {
  const today = useMemo(() => new Date(), []);
  const { data: canvasTerms } = useCanvasTermsQuery(today);
  const { data: emptyDirectories } = useEmptyDirectoriesQuery();
  const [selectedTerm, setSelectedTerm] = useState<
    CanvasEnrollmentTermModel | undefined
  >();
  const { data: canvasCourses } = useCourseListInTermQuery(selectedTerm?.id);
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<DayOfWeek[]>([]);
  const [selectedCanvasCourse, setSelectedCanvasCourse] = useState<
    CanvasCourseModel | undefined
  >();
  const [selectedDirectory, setSelectedDirectory] = useState<
    string | undefined
  >();

  return (
    <div>
      <SelectInput
        value={selectedTerm}
        setValue={setSelectedTerm}
        label={"Canvas Term"}
        options={canvasTerms}
        getOptionName={(t) => t.name}
      />
      {selectedTerm && (
        <>
          <SelectInput
            value={selectedCanvasCourse}
            setValue={setSelectedCanvasCourse}
            label={"Course"}
            options={canvasCourses}
            getOptionName={(c) => c.name}
          />
          <SelectInput
            value={selectedDirectory}
            setValue={setSelectedDirectory}
            label={"Storage Folder"}
            options={emptyDirectories}
            getOptionName={(d) => d}
          />
          <br />
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
        </>
      )}
      
    </div>
  );
}
