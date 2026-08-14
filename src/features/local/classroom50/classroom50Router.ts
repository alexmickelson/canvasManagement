import { z } from "zod";
import publicProcedure from "../../../services/serverFunctions/publicProcedure";
import { router } from "../../../services/serverFunctions/trpcSetup";
import { fileStorageService } from "@/features/local/utils/fileStorageService";
import { courseItemFileStorageService } from "../course/courseItemFileStorageService";
import { canvasService } from "@/features/canvas/services/canvasService";
import { getDateFromString } from "../utils/timeUtils";
import {
  assertSafeCliIdentifier,
  assertSafeTemplateRepo,
  runGhCommand,
  runTeacherCommand,
} from "./classroom50CliService";
import {
  classroomShortNamePattern,
  extensionListIncludesTeacher,
  parseClassroomList,
  parseGhAuthStatus,
  parseOrgMemberships,
} from "./classroom50SetupUtils";
import { RosterSyncSummaryData } from "./classroom50Types";

const getClassroom50Config = async (courseName: string) => {
  const settingsList = await fileStorageService.settings.getAllCoursesSettings();
  const settings = settingsList.find((s) => s.name === courseName);
  if (!settings)
    throw new Error(`Could not find settings for course ${courseName}`);
  if (!settings.classroom50)
    throw new Error(
      `Course ${courseName} has no Classroom 50 settings, configure the org and classroom on the course settings page first`
    );
  const { org, classroom } = settings.classroom50;
  assertSafeCliIdentifier(org, "org");
  assertSafeCliIdentifier(classroom, "classroom");
  return { settings, org, classroom };
};

// gh reads GH_TOKEN first, then GITHUB_TOKEN. knowing whether the server has
// one at all is the difference between "add a token" and "your token is bad"
const ghTokenIsSet = () =>
  !!(process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tryParseJson = (value: string): any => {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};


export const classroom50Router = router({
  getStatus: publicProcedure
    .input(z.string().describe("course name"))
    .query(async ({ input: courseName }) => {
      const settingsList =
        await fileStorageService.settings.getAllCoursesSettings();
      const settings = settingsList.find((s) => s.name === courseName);
      if (!settings?.classroom50) return { configured: false as const };
      const { org, classroom } = settings.classroom50;
      assertSafeCliIdentifier(org, "org");
      assertSafeCliIdentifier(classroom, "classroom");

      const [classroomResult, assignmentResult, rosterResult] =
        await Promise.all([
          runTeacherCommand(["classroom", "list", org, "--json", "--quiet"]),
          runTeacherCommand([
            "assignment",
            "list",
            org,
            classroom,
            "--json",
            "--quiet",
          ]),
          // roster list's --quiet changes the stdout format, so json only
          runTeacherCommand(["roster", "list", org, classroom, "--json"]),
        ]);

      const classrooms = parseClassroomList(classroomResult.stdout);
      const classroomFound =
        classrooms.length > 0
          ? classrooms.includes(classroom)
          : classroomResult.exitCode === 0 &&
            classroomResult.stdout.includes(classroom);

      const assignments = tryParseJson(assignmentResult.stdout);
      const assignmentSlugs: string[] = Array.isArray(assignments)
        ? assignments
            .map((a) => (typeof a === "string" ? a : a?.slug ?? a?.name))
            .filter((s): s is string => typeof s === "string")
        : [];

      const roster = tryParseJson(rosterResult.stdout);
      const rosterCount = Array.isArray(roster)
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          roster.filter((r: any) => !r?.role || r.role === "student").length
        : undefined;

      return {
        configured: true as const,
        classroomFound,
        assignmentSlugs,
        rosterCount,
        ghTokenSet: ghTokenIsSet(),
        results: [classroomResult, assignmentResult, rosterResult],
      };
    }),

  getEnvironmentStatus: publicProcedure.query(async () => {
    const version = await runGhCommand(["--version"], { timeoutMs: 20_000 });
    if (version.exitCode !== 0)
      return {
        ghInstalled: false as const,
        ghTokenSet: ghTokenIsSet(),
        results: [version],
      };

    const [extensions, authStatus, apiUser] = await Promise.all([
      runGhCommand(["extension", "list"], { timeoutMs: 20_000 }),
      runGhCommand(["auth", "status"], { timeoutMs: 30_000 }),
      runGhCommand(["api", "user", "--jq", ".login"], { timeoutMs: 30_000 }),
    ]);

    return {
      ghInstalled: true as const,
      ghTokenSet: ghTokenIsSet(),
      ghVersion: version.stdout.split("\n")[0]?.trim(),
      // gh exits non-zero when no extensions are installed at all
      extensionInstalled: extensionListIncludesTeacher(
        extensions.stdout + "\n" + extensions.stderr
      ),
      // gh auth status has historically written to stderr
      auth: parseGhAuthStatus(authStatus.stdout + "\n" + authStatus.stderr),
      apiUser: apiUser.exitCode === 0 ? apiUser.stdout.trim() : undefined,
      results: [version, extensions, authStatus, apiUser],
    };
  }),

  listOrgs: publicProcedure.query(async () => {
    const result = await runGhCommand(
      ["api", "user/memberships/orgs?state=active&per_page=100"],
      { timeoutMs: 30_000 }
    );
    return { orgs: parseOrgMemberships(result.stdout), result };
  }),

  getOrgStatus: publicProcedure
    .input(z.string().describe("GitHub organization"))
    .query(async ({ input: org }) => {
      assertSafeCliIdentifier(org, "org");
      const configRepo = await runGhCommand(
        ["api", `repos/${org}/classroom50`, "--jq", ".name"],
        { timeoutMs: 30_000 }
      );
      const initialized = configRepo.exitCode === 0;
      if (!initialized)
        return { initialized: false as const, classrooms: [], results: [configRepo] };

      const classroomsResult = await runTeacherCommand([
        "classroom",
        "list",
        org,
        "--json",
        "--quiet",
      ]);
      return {
        initialized: true as const,
        classrooms: parseClassroomList(classroomsResult.stdout),
        results: [configRepo, classroomsResult],
      };
    }),

  createClassroom: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        org: z.string().describe("GitHub organization"),
        shortName: z
          .string()
          .regex(
            classroomShortNamePattern,
            "short name must be lowercase letters, numbers, and dashes"
          ),
        displayName: z.string().min(1),
        term: z.string().min(1).describe('e.g. "Fall 2026"'),
      })
    )
    .mutation(
      async ({ input: { courseName, org, shortName, displayName, term } }) => {
        assertSafeCliIdentifier(org, "org");
        const settingsList =
          await fileStorageService.settings.getAllCoursesSettings();
        const settings = settingsList.find((s) => s.name === courseName);
        if (!settings)
          throw new Error(`Could not find settings for course ${courseName}`);

        const result = await runTeacherCommand([
          "classroom",
          "add",
          org,
          shortName,
          "--name",
          displayName,
          "--term",
          term,
        ]);

        const settingsSaved = result.exitCode === 0;
        if (settingsSaved) {
          await fileStorageService.settings.updateCourseSettings(courseName, {
            ...settings,
            classroom50: {
              org,
              classroom: shortName,
              baseUrl: settings.classroom50?.baseUrl,
            },
          });
        }
        return { result, settingsSaved };
      }
    ),

  // classroom 50 rosters are keyed by github username, which canvas does not
  // have, so this reconciles instead of importing: students matched by email
  // get their names updated, everyone else is reported
  syncRoster: publicProcedure
    .input(z.string().describe("course name"))
    .mutation(async ({ input: courseName }): Promise<RosterSyncSummaryData> => {
      const { settings, org, classroom } = await getClassroom50Config(
        courseName
      );
      const [rosterResult, students] = await Promise.all([
        runTeacherCommand(["roster", "list", org, classroom, "--json"]),
        canvasService.getEnrolledStudents(settings.canvasId),
      ]);

      type RosterRow = {
        username?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        role?: string;
      };
      const rows: RosterRow[] = Array.isArray(tryParseJson(rosterResult.stdout))
        ? tryParseJson(rosterResult.stdout)
        : [];
      const studentRows = rows.filter(
        (r): r is RosterRow & { username: string } =>
          !!r.username && (!r.role || r.role === "student")
      );

      const canvasByEmail = new Map(
        students
          .filter((s) => s.email)
          .map((s) => [s.email.toLowerCase(), s] as const)
      );

      const updated: string[] = [];
      const updateResults = [];
      const matchedEmails = new Set<string>();
      for (const row of studentRows) {
        const email = row.email?.toLowerCase();
        const canvasStudent = email ? canvasByEmail.get(email) : undefined;
        if (!email || !canvasStudent) continue;
        matchedEmails.add(email);

        // canvas sortable_name is "Last, First"
        const [lastName = "", firstName = ""] = canvasStudent.sortable_name
          .split(",")
          .map((part) => part.trim());
        const flags = [
          ...(firstName && firstName !== (row.first_name ?? "")
            ? ["--first-name", firstName]
            : []),
          ...(lastName && lastName !== (row.last_name ?? "")
            ? ["--last-name", lastName]
            : []),
        ];
        if (flags.length === 0) continue;

        assertSafeCliIdentifier(row.username, "username");
        const result = await runTeacherCommand([
          "roster",
          "update",
          org,
          classroom,
          row.username,
          ...flags,
        ]);
        updateResults.push(result);
        if (result.exitCode === 0) updated.push(row.username);
      }

      const unmatchedCanvas = students
        .filter((s) => !s.email || !matchedEmails.has(s.email.toLowerCase()))
        .map((s) => ({ name: s.name, email: s.email ?? "" }));
      const unmatchedRoster = studentRows
        .filter((r) => !r.email || !canvasByEmail.has(r.email.toLowerCase()))
        .map((r) => r.username);

      return {
        rosterResult,
        rosterCount: studentRows.length,
        updated,
        updateResults,
        unmatchedCanvas,
        unmatchedRoster,
      };
    }),

  createAssignment: publicProcedure
    .input(
      z.object({
        courseName: z.string(),
        moduleName: z.string(),
        assignmentName: z.string(),
        template: z
          .string()
          .optional()
          .describe("starter code repo, owner/repo or owner/repo@branch"),
        mode: z.enum(["individual", "group"]).optional(),
        maxGroupSize: z.number().int().min(2).optional(),
        emptyRepo: z.boolean().optional(),
      })
    )
    .mutation(
      async ({
        input: {
          courseName,
          moduleName,
          assignmentName,
          template,
          mode,
          maxGroupSize,
          emptyRepo,
        },
      }) => {
        const { org, classroom } = await getClassroom50Config(courseName);
        const assignment = await courseItemFileStorageService.getItem({
          courseName,
          moduleName,
          name: assignmentName,
          type: "Assignment",
        });
        const slug = assignment.classroom50Slug;
        if (!slug)
          throw new Error(
            `Assignment "${assignmentName}" has no Classroom50Slug, add one in the assignment settings block first`
          );
        assertSafeCliIdentifier(slug, "slug");
        if (template) assertSafeTemplateRepo(template);

        const dueDate = getDateFromString(assignment.dueAt);
        const args = [
          "assignment",
          "add",
          org,
          classroom,
          slug,
          "--name",
          assignment.name,
          ...(dueDate ? ["--due", dueDate.toISOString()] : []),
          ...(template ? ["--template", template] : []),
          ...(mode ? ["--mode", mode] : []),
          ...(mode === "group" && maxGroupSize
            ? ["--max-group-size", String(maxGroupSize)]
            : []),
          ...(emptyRepo ? ["--empty-repo"] : []),
        ];
        return { result: await runTeacherCommand(args), slug };
      }
    ),
});
