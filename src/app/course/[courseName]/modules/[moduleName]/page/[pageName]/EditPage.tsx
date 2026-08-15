"use client";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useEffect, useState } from "react";
import PagePreview from "./PagePreview";
import { useLocalCourseSettingsQuery } from "@/features/local/course/localCoursesHooks";
import EditPageButtons from "./EditPageButtons";
import ClientOnly from "@/components/ClientOnly";
import { useCourseContext } from "@/app/course/[courseName]/context/courseContext";
import { useAuthoritativeUpdates } from "@/app/course/[courseName]/utils/useAuthoritativeUpdates";
import EditPageHeader from "./EditPageHeader";
import { UpdatePageName } from "./UpdatePageName";
import { EditLayout } from "@/components/EditLayout";
import { localPageMarkdownUtils } from "@/features/local/pages/localCoursePageModels";
import {
  usePageQuery,
  useUpdatePageMutation,
} from "@/features/local/pages/pageHooks";

export default function EditPage({
  moduleName,
  pageName,
}: {
  pageName: string;
  moduleName: string;
}) {
  const { courseName } = useCourseContext();
  const {
    data: page,
    dataUpdatedAt,
    isFetching,
  } = usePageQuery(moduleName, pageName);
  const updatePage = useUpdatePageMutation();

  const { clientIsAuthoritative, text, textUpdate, monacoKey } =
    useAuthoritativeUpdates({
      serverUpdatedAt: dataUpdatedAt,
      startingText: localPageMarkdownUtils.toMarkdown(page),
    });

  const [error, setError] = useState("");
  const { data: settings } = useLocalCourseSettingsQuery();

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
          pageName,
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
          } else {
            console.log(
              "client not authoritative, updating client with server page",
            );
            textUpdate(localPageMarkdownUtils.toMarkdown(page), true);
          }
        }
        setError("");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    text,
    textUpdate,
    updatePage,
  ]);

  return (
    <EditLayout
      Header={<EditPageHeader pageName={pageName} />}
      HeaderActions={
        <UpdatePageName pageName={pageName} moduleName={moduleName} />
      }
      Editor={<MonacoEditor key={monacoKey} value={text} onChange={textUpdate} />}
      Preview={
        <div className="h-full flex flex-col overflow-hidden">
          <div className="text-red-300">{error && error}</div>
          <div className="flex-1 overflow-y-auto">
            <br />
            <PagePreview page={page} />
          </div>
        </div>
      }
      Footer={
        <>
          {settings.canvasId && (
            <ClientOnly>
              <EditPageButtons pageName={pageName} moduleName={moduleName} />
            </ClientOnly>
          )}
        </>
      }
    />
  );
}
