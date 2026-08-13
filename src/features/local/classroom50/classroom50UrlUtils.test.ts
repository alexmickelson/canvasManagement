import { describe, it, expect } from "vitest";
import {
  getClassroom50AcceptUrl,
  getClassroom50ClassPageUrl,
  getClassroom50LocalCommands,
} from "./classroom50UrlUtils";
import {
  assertSafeCliIdentifier,
  assertSafeTemplateRepo,
} from "./classroom50CliService";
import { DayOfWeek, LocalCourseSettings } from "../course/localCourseSettings";

const settingsWith = (
  classroom50?: LocalCourseSettings["classroom50"]
): LocalCourseSettings => ({
  name: "test course",
  assignmentGroups: [],
  daysOfWeek: [DayOfWeek.Monday],
  startDate: "07/09/2024 23:59:00",
  endDate: "07/09/2024 23:59:00",
  defaultDueTime: { hour: 23, minute: 59 },
  canvasId: 0,
  defaultAssignmentSubmissionTypes: [],
  defaultFileUploadTypes: [],
  holidays: [],
  assets: [],
  classroom50,
});

describe("classroom50 urls", () => {
  it("builds the class page url with the default base", () => {
    const settings = settingsWith({ org: "my-org", classroom: "my-class" });
    expect(getClassroom50ClassPageUrl(settings)).toEqual(
      "https://classroom50.org/my-org/my-class"
    );
  });

  it("strips trailing slashes from a custom base url", () => {
    const settings = settingsWith({
      org: "my-org",
      classroom: "my-class",
      baseUrl: "https://classroom.example.edu/",
    });
    expect(getClassroom50AcceptUrl(settings, "lab-1")).toEqual(
      "https://classroom.example.edu/my-org/my-class/assignments/lab-1"
    );
  });

  it("returns undefined when not configured", () => {
    expect(getClassroom50ClassPageUrl(settingsWith())).toBeUndefined();
    expect(
      getClassroom50AcceptUrl(
        settingsWith({ org: "my-org", classroom: "my-class" }),
        undefined
      )
    ).toBeUndefined();
    expect(getClassroom50LocalCommands(settingsWith())).toBeUndefined();
  });

  it("builds local commands", () => {
    const commands = getClassroom50LocalCommands(
      settingsWith({ org: "my-org", classroom: "my-class" }),
      "lab-1"
    );
    expect(commands?.downloadSubmissions).toEqual(
      "gh teacher download my-org my-class lab-1 -d ./grading/lab-1"
    );
    expect(commands?.audit).toEqual("gh teacher audit my-org");
  });
});

describe("cli argument validation", () => {
  it("accepts normal identifiers", () => {
    expect(() => assertSafeCliIdentifier("my-org", "org")).not.toThrow();
    expect(() => assertSafeCliIdentifier("cs50.fall_2026", "org")).not.toThrow();
  });

  it("rejects shell metacharacters and flag injection", () => {
    expect(() => assertSafeCliIdentifier("org; rm -rf /", "org")).toThrow();
    expect(() => assertSafeCliIdentifier("org name", "org")).toThrow();
    expect(() => assertSafeCliIdentifier("$(whoami)", "org")).toThrow();
    expect(() => assertSafeCliIdentifier("", "org")).toThrow();
    expect(() => assertSafeCliIdentifier("--verbose", "org")).toThrow();
    expect(() => assertSafeCliIdentifier("-q", "org")).toThrow();
  });

  it("validates template repos", () => {
    expect(() => assertSafeTemplateRepo("owner/repo")).not.toThrow();
    expect(() => assertSafeTemplateRepo("owner/repo@main")).not.toThrow();
    expect(() => assertSafeTemplateRepo("not-a-repo")).toThrow();
    expect(() => assertSafeTemplateRepo("owner/repo; ls")).toThrow();
  });
});
