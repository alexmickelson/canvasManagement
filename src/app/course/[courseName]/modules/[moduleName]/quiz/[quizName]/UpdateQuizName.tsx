import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import TextInput from "@/components/form/TextInput";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import {
  useQuizQuery,
  useUpdateQuizMutation,
} from "@/features/local/quizzes/quizHooks";
import { getModuleItemUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdateQuizName({
  moduleName,
  quizName,
}: {
  quizName: string;
  moduleName: string;
}) {
  const modal = useModal();
  const { courseName } = useCourseContext();
  const router = useRouter();
  const { data: quiz } = useQuizQuery(moduleName, quizName);
  const updateQuiz = useUpdateQuizMutation();
  const [name, setName] = useState(quiz.name);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Modal
        modalControl={modal}
        buttonText="Rename Quiz"
        buttonClass="py-0"
        modalWidth="w-1/5"
      >
        {({ closeModal }) => (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (name === quizName) closeModal();

              setIsLoading(true); // page refresh resets flag
              await updateQuiz.mutateAsync({
                quiz: quiz,
                moduleName,
                quizName: name,
                previousModuleName: moduleName,
                previousQuizName: quizName,
                courseName,
              });

              // update url (will trigger reload...)
              router.replace(
                getModuleItemUrl(courseName, moduleName, "quiz", name),
                {}
              );
            }}
          >
            <TextInput value={name} setValue={setName} label={"Rename Quiz"} />
            <button className="w-full my-3">Save New Name</button>
            {isLoading && <Spinner />}
          </form>
        )}
      </Modal>
    </div>
  );
}
