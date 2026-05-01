import { createFileRoute } from "@tanstack/react-router";
import AllSettings from "@/app/course/[courseName]/settings/AllSettings";

export const Route = createFileRoute("/course/$courseName/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex justify-center h-full overflow-auto pt-5">
      <div className="w-fit">
        <AllSettings />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
