"use client";
import { useState } from "react";
import CopyableCommand from "./CopyableCommand";

// the commands shown next to this note run on the faculty machine, not on the
// server, so the server's gh (which lives inside the container) does not help
export default function LocalGhSetupNote() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="text-sm">
      <button
        className="unstyled text-slate-400 hover:text-slate-200 underline"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen
          ? "hide setup steps"
          : 'getting "unknown command teacher"? set up gh on your machine'}
      </button>
      {isOpen && (
        <div className="ms-2 mt-1 text-slate-400">
          <p>
            These run on the computer you grade on, not on the canvasManager
            server. The server has its own gh inside its container, so the
            checks above being green does not mean your machine is ready.
          </p>
          <p className="mt-1">
            Windows and WSL each have their own gh install with their own
            extensions. Set up gh in whichever one you actually grade in —
            installing it in both is fine.
          </p>
          <ol className="list-decimal ms-5 my-1 flex flex-col gap-1">
            <li>
              Install the GitHub CLI — Windows (PowerShell):
              <CopyableCommand command="winget install --id GitHub.cli" />
              macOS:
              <CopyableCommand command="brew install gh" />
              Ubuntu / WSL:
              <CopyableCommand command="sudo apt install gh" />
            </li>
            <li>
              Sign in:
              <CopyableCommand command="gh auth login" />
            </li>
            <li>
              Add the teacher extension:
              <CopyableCommand command="gh extension install foundation50/gh-teacher" />
            </li>
            <li>
              Check that it worked — this should list the teacher commands
              instead of &quot;unknown command&quot;:
              <CopyableCommand command="gh teacher --help" />
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
