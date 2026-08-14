// pure helpers for the classroom 50 setup wizard, safe to import client-side

import { Classroom50CommandResult } from "./classroom50Types";

export const requiredGhScopes = ["admin:org", "repo", "workflow"];

// classroom 50 short-name rules
export const classroomShortNamePattern = /^[a-z0-9][a-z0-9-]{1,38}$/;

export interface GhAuthStatus {
  loggedIn: boolean;
  account?: string;
  // undefined when gh doesn't report scopes (e.g. fine-grained tokens)
  scopes?: string[];
  missingScopes?: string[];
}

// `gh auth status` writes to stderr on some versions, callers pass stdout+stderr
export const parseGhAuthStatus = (output: string): GhAuthStatus => {
  const loggedInMatch = /Logged in to [^\s]+ (?:account |as )([\w[\]-]+)/.exec(
    output
  );
  if (!loggedInMatch) return { loggedIn: false };

  const scopesMatch = /Token scopes: (.*)/.exec(output);
  if (!scopesMatch) return { loggedIn: true, account: loggedInMatch[1] };

  const scopes = scopesMatch[1]
    .split(",")
    .map((s) => s.trim().replaceAll(/^'|'$/g, ""))
    .filter((s) => s.length > 0);
  const missingScopes = requiredGhScopes.filter(
    (required) => !scopes.includes(required)
  );
  return {
    loggedIn: true,
    account: loggedInMatch[1],
    scopes,
    missingScopes,
  };
};

// gh, gh-teacher, and the github api each phrase "no usable token" differently.
// used to turn a raw command failure into the GH_TOKEN setup instructions
const authFailurePatterns = [
  /not signed in to/i,
  /not logged in/i,
  /gh (teacher |auth )?login/i,
  /requires authentication/i,
  /bad credentials/i,
  /HTTP 401/i,
];

export const isAuthFailureOutput = (output: string) =>
  authFailurePatterns.some((pattern) => pattern.test(output));

export const isAuthFailureResult = (
  result: Classroom50CommandResult | undefined
) =>
  !!result &&
  result.exitCode !== 0 &&
  isAuthFailureOutput(`${result.stderr}\n${result.stdout}`);

export const extensionListIncludesTeacher = (output: string) =>
  /\bgh-teacher\b/.test(output);

export const parseOrgMemberships = (
  json: string
): { login: string; isAdmin: boolean }[] => {
  try {
    const memberships = JSON.parse(json);
    if (!Array.isArray(memberships)) return [];
    return memberships
      .map((m) => ({
        login: m?.organization?.login as string | undefined,
        isAdmin: m?.role === "admin",
      }))
      .filter((m): m is { login: string; isAdmin: boolean } => !!m.login);
  } catch {
    return [];
  }
};

export const parseClassroomList = (output: string): string[] => {
  try {
    const classrooms = JSON.parse(output);
    if (!Array.isArray(classrooms)) return [];
    return classrooms
      .map((c) =>
        typeof c === "string"
          ? c
          : (c?.short_name ?? c?.shortName ?? c?.slug ?? c?.name)
      )
      .filter((c): c is string => typeof c === "string");
  } catch {
    return [];
  }
};

export const suggestTerm = (startDate: string | undefined) => {
  const parsed = startDate ? new Date(startDate) : undefined;
  const date = parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
  const month = date.getMonth();
  const season = month <= 4 ? "Spring" : month <= 6 ? "Summer" : "Fall";
  return `${season} ${date.getFullYear()}`;
};

export const suggestClassroomShortName = (
  courseName: string,
  startDate: string | undefined
) => {
  const term = suggestTerm(startDate).toLowerCase().replace(" ", "-");
  const base = courseName
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
    .replaceAll(/^[^a-z0-9]+/g, "");
  const shortName = `${base}-${term}`.slice(0, 39).replaceAll(/-+$/g, "");
  return classroomShortNamePattern.test(shortName) ? shortName : term;
};

// classic tokens support scope prefill via url, fine-grained tokens do not
export const ghTokenCreationUrl = `https://github.com/settings/tokens/new?scopes=${requiredGhScopes.join(
  ","
)}&description=canvasManager%20classroom50`;

export const newOrgUrl = "https://github.com/account/organizations/new";
export const githubEducationUrl = "https://education.github.com/discount_requests/pack_application";
