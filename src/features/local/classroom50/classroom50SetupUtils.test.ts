import { describe, it, expect } from "vitest";
import {
  extensionListIncludesTeacher,
  parseClassroomList,
  parseGhAuthStatus,
  parseOrgMemberships,
  suggestClassroomShortName,
  suggestTerm,
} from "./classroom50SetupUtils";

describe("parseGhAuthStatus", () => {
  it("parses a logged in status with scopes", () => {
    const output = `github.com
  ✓ Logged in to github.com account jallen-snow (GH_TOKEN)
  - Active account: true
  - Git operations protocol: https
  - Token: gho_****
  - Token scopes: 'admin:org', 'repo', 'workflow'`;
    const status = parseGhAuthStatus(output);
    expect(status.loggedIn).toBe(true);
    expect(status.account).toBe("jallen-snow");
    expect(status.scopes).toEqual(["admin:org", "repo", "workflow"]);
    expect(status.missingScopes).toEqual([]);
  });

  it("reports missing scopes", () => {
    const output = `  ✓ Logged in to github.com account jallen (keyring)
  - Token scopes: 'repo'`;
    const status = parseGhAuthStatus(output);
    expect(status.missingScopes).toEqual(["admin:org", "workflow"]);
  });

  it("handles the older 'as <user>' phrasing", () => {
    const output = `✓ Logged in to github.com as jallen (oauth_token)`;
    const status = parseGhAuthStatus(output);
    expect(status.loggedIn).toBe(true);
    expect(status.account).toBe("jallen");
  });

  it("handles fine-grained tokens with no scopes line", () => {
    const output = `✓ Logged in to github.com account jallen (GH_TOKEN)`;
    const status = parseGhAuthStatus(output);
    expect(status.loggedIn).toBe(true);
    expect(status.scopes).toBeUndefined();
    expect(status.missingScopes).toBeUndefined();
  });

  it("reports logged out", () => {
    const status = parseGhAuthStatus(
      "You are not logged into any GitHub hosts. To log in, run: gh auth login"
    );
    expect(status.loggedIn).toBe(false);
  });
});

describe("extensionListIncludesTeacher", () => {
  it("finds the extension", () => {
    expect(
      extensionListIncludesTeacher(
        "gh teacher\tfoundation50/gh-teacher\tv1.2.0\ngh student\tfoundation50/gh-student\tv1.2.0"
      )
    ).toBe(true);
  });
  it("handles no extensions", () => {
    expect(extensionListIncludesTeacher("no installed extensions found")).toBe(
      false
    );
  });
});

describe("parseOrgMemberships", () => {
  it("extracts logins and admin roles", () => {
    const json = JSON.stringify([
      { organization: { login: "snow-cs" }, role: "admin" },
      { organization: { login: "other-org" }, role: "member" },
    ]);
    expect(parseOrgMemberships(json)).toEqual([
      { login: "snow-cs", isAdmin: true },
      { login: "other-org", isAdmin: false },
    ]);
  });
  it("returns empty on garbage", () => {
    expect(parseOrgMemberships("not json")).toEqual([]);
    expect(parseOrgMemberships("{}")).toEqual([]);
  });
});

describe("parseClassroomList", () => {
  it("handles objects with short_name", () => {
    expect(
      parseClassroomList(
        JSON.stringify([{ short_name: "cs-1405" }, { short_name: "cs-3820" }])
      )
    ).toEqual(["cs-1405", "cs-3820"]);
  });
  it("handles plain strings and garbage", () => {
    expect(parseClassroomList(JSON.stringify(["a", "b"]))).toEqual(["a", "b"]);
    expect(parseClassroomList("nope")).toEqual([]);
  });
});

describe("classroom suggestions", () => {
  it("suggests a term from the start date", () => {
    expect(suggestTerm("01/08/2027 08:00:00")).toBe("Spring 2027");
    expect(suggestTerm("06/10/2026 08:00:00")).toBe("Summer 2026");
    expect(suggestTerm("08/24/2026 08:00:00")).toBe("Fall 2026");
  });

  it("suggests a valid short name from a course name", () => {
    expect(suggestClassroomShortName("1405 Engr", "01/08/2027 08:00:00")).toBe(
      "1405-engr-spring-2027"
    );
    expect(
      suggestClassroomShortName("Advanced C# (Honors!)", "08/24/2026 08:00:00")
    ).toBe("advanced-c-honors-fall-2026");
  });

  it("truncates long names to the 39 character limit", () => {
    const suggestion = suggestClassroomShortName(
      "a very long course name that goes on and on forever",
      "08/24/2026 08:00:00"
    );
    expect(suggestion.length).toBeLessThanOrEqual(39);
    expect(suggestion).toMatch(/^[a-z0-9][a-z0-9-]{1,38}$/);
  });
});
