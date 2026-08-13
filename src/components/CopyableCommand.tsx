"use client";
import { useState } from "react";

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // clipboard api is unavailable outside secure contexts (e.g. http over lan)
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

export default function CopyableCommand({
  command,
  note,
}: {
  command: string;
  note?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      {note && <div className="text-slate-500 text-sm">{note}</div>}
      <div className="flex flex-row items-stretch border border-slate-500 rounded-md overflow-hidden my-1">
        <pre className="flex-1 min-w-0 overflow-x-auto px-3 py-2 my-auto text-sm">
          <code>{command}</code>
        </pre>
        <button
          className="unstyled shrink-0 border-s border-slate-500 px-3 text-sm hover:bg-slate-800"
          onClick={async () => {
            await copyTextToClipboard(command);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
