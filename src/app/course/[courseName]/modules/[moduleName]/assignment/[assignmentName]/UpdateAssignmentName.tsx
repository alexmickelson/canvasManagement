import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import TextInput from "@/components/form/TextInput";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import {
  useAssignmentQuery,
  useUpdateAssignmentMutation,
} from "@/hooks/localCourse/assignmentHooks";
import { getModuleItemUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdateAssignmentName({
  moduleName,
  assignmentName,
}: {
  assignmentName: string;
  moduleName: string;
}) {
  const modal = useModal();
  const { courseName } = useCourseContext();
  const router = useRouter();
  const [assignment] = useAssignmentQuery(moduleName, assignmentName);
  const updateAssignment = useUpdateAssignmentMutation();
  const [name, setName] = useState(assignment.name);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <Modal
        modalControl={modal}
        buttonText="Rename Assignment"
        buttonClass="py-0"
        modalWidth="w-1/5"
      >
        {({ closeModal }) => (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (name === assignmentName) closeModal();

              setIsLoading(true); // page refresh resets flag
              await updateAssignment.mutateAsync({
                assignment: assignment,
                moduleName,
                assignmentName: name,
                previousModuleName: moduleName,
                previousAssignmentName: assignmentName,
                courseName,
              });

              // update url (will trigger reload...)
              router.replace(
                getModuleItemUrl(courseName, moduleName, "assignment", name),
                {}
              );
            }}
          >
            <TextInput
              value={name}
              setValue={setName}
              label={"Rename Assignment"}
            />
            <button className="w-full my-3">Save New Name</button>
            {isLoading && <Spinner />}
          </form>
        )}
      </Modal>
    </div>
  );
}
