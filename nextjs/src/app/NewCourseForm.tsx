import { DayOfWeekInput } from "@/components/form/DayOfWeekInput";
import SelectInput from "@/components/form/SelectInput";
import { useCanvasTermsQuery } from "@/hooks/canvas/canvasHooks";
import { CanvasEnrollmentTermModel } from "@/models/canvas/enrollmentTerms/canvasEnrollmentTermModel";
import { DayOfWeek } from "@/models/local/localCourse";
import React, { useState } from "react";

export default function NewCourseForm() {
  const { data: canvasTerms } = useCanvasTermsQuery(new Date());

  const [selectedTerm, setSelectedTerm] = useState<
    CanvasEnrollmentTermModel | undefined
  >();
  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<DayOfWeek[]>([]);

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
        <div>
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
      )}
    </div>
  );
}
