"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import {
  usePageQuery,
  useUpdatePageMutation,
} from "@/hooks/localCourse/pageHooks";
import { localPageMarkdownUtils } from "@/models/local/page/localCoursePage";
import { useEffect, useState } from "react";
import PagePreview from "./PagePreview";
import { useLocalCourseSettingsQuery } from "@/hooks/localCourse/localCoursesHooks";
import EditPageButtons from "./EditPageButtons";
import ClientOnly from "@/components/ClientOnly";
import { useRouter } from "next/navigation";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useAuthoritativeUpdates } from "@/app/course/[courseName]/utils/useAuthoritativeUpdates";
import EditPageHeader from "./EditPageHeader";

export default function EditPage({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const router = useRouter();
  const { courseName } = useCourseContext();
  const [page, { dataUpdatedAt, isFetching }] = usePageQuery(
    moduleName,
    pageName
  );
  const updatePage = useUpdatePageMutation();

  const { clientIsAuthoritative, text, textUpdate, monacoKey } =
    useAuthoritativeUpdates({
      serverUpdatedAt: dataUpdatedAt,
      startingText: localPageMarkdownUtils.toMarkdown(page),
    });

  const [error, setError] = useState("");
  const [settings] = useLocalCourseSettingsQuery();

  useEffect(() => {
    const delay = 500;
    const handler = setTimeout(() => {
      if (isFetching || updatePage.isPending) {
        console.log("network requests in progress, not updating page");
        return;
      }

      try {
        const updatedPage = localPageMarkdownUtils.parseMarkdown(
          text,
          pageName
        );
        if (
          localPageMarkdownUtils.toMarkdown(page) !==
          localPageMarkdownUtils.toMarkdown(updatedPage)
        ) {
          if (clientIsAuthoritative) {
            console.log("updating page");
            updatePage.mutateAsync({
              page: updatedPage,
              moduleName,
              pageName,
              previousModuleName: moduleName,
              previousPageName: pageName,
              courseName,
            });
            // .then(() => {
            //   if (updatedPage.name !== pageName)
            //     router.replace(
            //       getModuleItemUrl(
            //         courseName,
            //         moduleName,
            //         "page",
            //         updatedPage.name
            //       )
            //     );
            // });
          } else {
            console.log(
              "client not authoritative, updating client with server page"
            );
            textUpdate(localPageMarkdownUtils.toMarkdown(page), true);
          }
        }
        setError("");
      } catch (e: any) {
        setError(e.toString());
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [
    clientIsAuthoritative,
    courseName,
    isFetching,
    moduleName,
    page,
    pageName,
    router,
    text,
    textUpdate,
    updatePage,
  ]);

  return (
    <div className="h-full flex flex-col">
      <EditPageHeader pageName={pageName} moduleName={moduleName} />
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />
        </div>
        <div className="h-full">
          <div className="text-red-300">{error && error}</div>
          <div className="h-full overflow-y-auto">
            <br />
            <PagePreview page={page} />
          </div>
        </div>
      </div>
      {settings.canvasId && (
        <ClientOnly>
          <EditPageButtons pageName={pageName} moduleName={moduleName} />
        </ClientOnly>
      )}
    </div>
  );
}
