"use client";
import CopyableCommand from "@/components/CopyableCommand";
import {
  ghTokenCreationUrl,
  requiredGhScopes,
} from "@/features/local/classroom50/classroom50SetupUtils";

// every Classroom 50 button shells out to gh on the server, so the token has to
// live in the server's environment. signing in with gh on your own machine does
// nothing for these buttons, which is the confusing part worth spelling out
export function GhTokenInstructions() {
  return (
    <ol className="list-decimal ms-5 my-1 flex flex-col gap-1">
      <li>
        <a
          href={ghTokenCreationUrl}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Create a GitHub token
        </a>{" "}
        — the link pre-selects the needed scopes ({requiredGhScopes.join(", ")}).
        Pick an expiration, click <b>Generate token</b>, and copy it.
      </li>
      <li>
        Add it to the <code>.env</code> file the server starts with — the same
        file CANVAS_TOKEN is in, next to <code>docker-compose.yml</code> in
        production:
        <CopyableCommand command="GH_TOKEN=paste-your-token-here" />
      </li>
      <li>
        Restart the server. Environment variables are only read when the
        container starts, so editing <code>.env</code> alone changes nothing:
        <CopyableCommand command="docker compose up -d --force-recreate" />
        (or restart <code>./run.sh</code> when developing)
      </li>
    </ol>
  );
}

export default function Classroom50AuthHelp({
  ghTokenSet,
}: {
  // undefined when we could not check the server's environment
  ghTokenSet?: boolean;
}) {
  return (
    <div className="border border-amber-400/40 rounded-md p-2 my-2 text-sm">
      <div className="text-amber-300">
        {ghTokenSet === false
          ? "The server has no GH_TOKEN, so every Classroom 50 command fails."
          : ghTokenSet === true
            ? "GitHub rejected the server's GH_TOKEN — it has probably expired or been revoked."
            : "The server is not signed in to GitHub."}
      </div>
      <p className="text-slate-400 mt-1">
        These commands run on the canvasManager server, inside its container —
        not on your computer. Running <code>gh auth login</code> on your own
        machine will not fix this.
      </p>
      <div className="text-slate-400">
        <GhTokenInstructions />
      </div>
    </div>
  );
}
