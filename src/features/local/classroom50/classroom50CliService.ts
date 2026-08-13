import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Classroom50CommandResult } from "./classroom50Types";

const execFileAsync = promisify(execFile);

// gh teacher identifiers (orgs, classrooms, slugs, usernames) are the only
// user-controlled values that reach the command line; nothing else is allowed.
// first char must be alphanumeric so a value can never be parsed as a flag
const safeIdentifierPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
export const assertSafeCliIdentifier = (value: string, label: string) => {
  if (!safeIdentifierPattern.test(value)) {
    throw new Error(
      `${label} "${value}" has characters that are not allowed in a Classroom 50 identifier`
    );
  }
};

const templatePattern = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+(@[A-Za-z0-9./_-]+)?$/;
export const assertSafeTemplateRepo = (value: string) => {
  if (!templatePattern.test(value)) {
    throw new Error(
      `template "${value}" must look like owner/repo or owner/repo@branch`
    );
  }
};

export const runGhCommand = async (
  args: string[],
  { timeoutMs = 120_000 }: { timeoutMs?: number } = {}
): Promise<Classroom50CommandResult> => {
  if (process.env.CLASSROOM50_EXEC_DISABLED === "true") {
    throw new Error(
      "Classroom 50 command execution is disabled on this server (CLASSROOM50_EXEC_DISABLED)"
    );
  }
  const command = ["gh", ...args].join(" ");
  const start = Date.now();
  try {
    const { stdout, stderr } = await execFileAsync("gh", args, {
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      env: process.env,
    });
    return {
      command,
      stdout,
      stderr,
      exitCode: 0,
      durationMs: Date.now() - start,
    };
  } catch (e) {
    const error = e as {
      stdout?: string;
      stderr?: string;
      code?: number | string;
      killed?: boolean;
      message?: string;
    };
    const durationMs = Date.now() - start;
    if (error.code === "ENOENT") {
      return {
        command,
        stdout: "",
        stderr:
          "The gh cli is not installed on the server. " +
          "Rebuild the docker image with gh + the gh-teacher extension, or run this command locally.",
        exitCode: 127,
        durationMs,
      };
    }
    return {
      command,
      stdout: error.stdout ?? "",
      stderr:
        (error.stderr || error.message || "command failed") +
        (error.killed ? `\n(command timed out after ${timeoutMs}ms)` : ""),
      exitCode: typeof error.code === "number" ? error.code : 1,
      durationMs,
    };
  }
};

export const runTeacherCommand = (
  args: string[],
  opts: { timeoutMs?: number } = {}
) => runGhCommand(["teacher", ...args], opts);
