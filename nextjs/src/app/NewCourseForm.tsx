import SelectInput from "@/components/form/SelectInput";
import { useCanvasTermsQuery } from "@/hooks/canvas/canvasHooks";
import { CanvasEnrollmentTermModel } from "@/models/canvas/enrollmentTerms/canvasEnrollmentTermModel";
import React, { useState } from "react";

export default function NewCourseForm() {
  const { data: canvasTerms } = useCanvasTermsQuery(new Date());

  const [selectedTerm, setSelectedTerm] = useState<
    CanvasEnrollmentTermModel | undefined
  >();

  return (
    <form>
      form is here
      <SelectInput
        value={selectedTerm}
        setValue={setSelectedTerm}
        label={"Canvas Term"}
        options={canvasTerms}
        getOptionName={(t) => t.name}
      />
    </form>
  );
}
