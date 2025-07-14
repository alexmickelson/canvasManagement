import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import TextInput from "@/components/form/TextInput";
import Modal, { useModal } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";
import {
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/localCourse/pageHooks";
import { getModuleItemUrl } from "@/services/urlUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePageName({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const modal = useModal();
  const { courseName } = useCourseContext();
  const router = useRouter();
  const { data: page } = usePageQuery(moduleName, pageName);
  const updatePage = useUpdatePageMutation();
  const [name, setName] = useState(page.name);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Modal
        modalControl={modal}
        buttonText="Rename Page"
        buttonClass="py-0"
        modalWidth="w-1/5"
      >
        {({ closeModal }) => (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (name === pageName) closeModal();

              setIsLoading(true); // page refresh resets flag
              await updatePage.mutateAsync({
                page: page,
                moduleName,
                pageName: name,
                previousModuleName: moduleName,
                previousPageName: pageName,
                courseName,
              });

              // update url (will trigger reload...)
              router.replace(
                getModuleItemUrl(courseName, moduleName, "page", name),
                {}
              );
            }}
          >
            <TextInput value={name} setValue={setName} label={"Rename Page"} />
            <button className="w-full my-3">Save New Name</button>
            {isLoading && <Spinner />}
          </form>
        )}
      </Modal>
    </div>
  );
}
