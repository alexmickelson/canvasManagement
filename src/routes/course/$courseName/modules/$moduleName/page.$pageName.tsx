import { createFileRoute } from "@tanstack/react-router";
import EditPage from "@/app/course/[courseName]/modules/[moduleName]/page/[pageName]/EditPage";

export const Route = createFileRoute(
  "/course/$courseName/modules/$moduleName/page/$pageName",
)({
  component: PageEditorPage,
});

function PageEditorPage() {
  const { moduleName, pageName } = Route.useParams();
  const decodedPageName = decodeURIComponent(pageName);
  const decodedModuleName = decodeURIComponent(moduleName);
  return <EditPage pageName={decodedPageName} moduleName={decodedModuleName} />;
}
