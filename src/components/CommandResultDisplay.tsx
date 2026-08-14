"use client";
import { isAuthFailureResult } from "@/features/local/classroom50/classroom50SetupUtils";
import { Classroom50CommandResult } from "@/features/local/classroom50/classroom50Types";

export default function CommandResultDisplay({
  result,
}: {
  result: Classroom50CommandResult;
}) {
  const succeeded = result.exitCode === 0;
  return (
    <div className="border border-slate-500 rounded-md p-2 my-2 text-sm">
      <div className="flex flex-row justify-between gap-3">
        <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap text-slate-400">
          $ {result.command}
        </code>
        <span
          className={
            "shrink-0 " + (succeeded ? "text-emerald-300" : "text-rose-300")
          }
        >
          exit {result.exitCode}
        </span>
      </div>
      {result.stdout && (
        <pre className="overflow-x-auto mt-1">{result.stdout}</pre>
      )}
      {result.stderr && (
        <pre className="overflow-x-auto mt-1 text-rose-300">
          {result.stderr}
        </pre>
      )}
      {isAuthFailureResult(result) && (
        <div className="mt-1 text-amber-300">
          This ran on the canvasManager server, not on your machine — its
          GH_TOKEN is missing or was rejected. The Classroom 50 setup wizard on
          the course settings page has the steps to fix it.
        </div>
      )}
    </div>
  );
}
