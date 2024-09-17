"use client";

import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useState } from "react";

export default function EditLecture({ lectureDay }: { lectureDay: string }) {
  const [text, setText] = useState("");
  return (
    <div className="h-full flex flex-col">
      <div className="columns-2 min-h-0 flex-1">
        <div className="flex-1 h-full">
          <MonacoEditor value={text} onChange={setText} />
        </div>
        <div className="h-full">
          {/* <div className="text-red-300">{error && error}</div> */}
          {/* <AssignmentPreview assignment={assignment} /> */}
        </div>
      </div>
    </div>
  );
}
