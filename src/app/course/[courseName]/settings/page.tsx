import { Metadata } from "next";
import AllSettings from "./AllSettings";
import { getTitle } from "@/services/titleUtils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseName: string }>;
}): Promise<Metadata> {
  const { courseName } = await params;
  const decodedCourseName = decodeURIComponent(courseName);
  return {
    title: getTitle(decodedCourseName) + " Settings",
  };
}

export default function page() {
  return (
    <div className="flex justify-center h-full overflow-auto pt-5  ">
      <div className=" w-fit ">
        <AllSettings />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}
