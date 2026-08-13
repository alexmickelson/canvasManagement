"use client";
import CommandResultDisplay from "@/components/CommandResultDisplay";
import CopyableCommand from "@/components/CopyableCommand";
import TextInput from "@/components/form/TextInput";
import { Spinner } from "@/components/Spinner";
import {
  useClassroom50EnvironmentQuery,
  useClassroom50OrgsQuery,
  useClassroom50OrgStatusQuery,
  useCreateClassroom50ClassroomMutation,
} from "@/features/local/classroom50/classroom50Hooks";
import {
  ghTokenCreationUrl,
  githubEducationUrl,
  newOrgUrl,
  suggestClassroomShortName,
  suggestTerm,
} from "@/features/local/classroom50/classroom50SetupUtils";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/features/local/course/localCoursesHooks";
import { useTRPC } from "@/services/serverFunctions/trpcClient";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

function CheckRow({
  status,
  label,
  children,
}: {
  status: "ok" | "fail" | "warn" | "pending";
  label: ReactNode;
  children?: ReactNode;
}) {
  const icon =
    status === "ok" ? (
      <span className="text-emerald-300">✓</span>
    ) : status === "warn" ? (
      <span className="text-amber-300">!</span>
    ) : status === "pending" ? (
      <Spinner />
    ) : (
      <span className="text-rose-300">✗</span>
    );
  return (
    <div className="my-2">
      <div className="flex flex-row gap-2 items-baseline">
        <span className="w-4 text-center">{icon}</span>
        <span>{label}</span>
      </div>
      {status !== "ok" && status !== "pending" && children && (
        <div className="ms-6 mt-1 text-sm text-slate-400">{children}</div>
      )}
    </div>
  );
}

function GhTokenInstructions() {
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
        — the link pre-selects the needed scopes (admin:org, repo, workflow).
        Pick an expiration, click <b>Generate token</b>, and copy it.
      </li>
      <li>
        Add it to the <code>.env</code> file next to CANVAS_TOKEN:
        <CopyableCommand command="GH_TOKEN=paste-your-token-here" />
      </li>
      <li>
        Restart the server (<code>./run.sh</code> for dev, or restart the
        container in production).
      </li>
    </ol>
  );
}

export function CreateClassroomForm({
  org,
  onCreated,
}: {
  org: string;
  onCreated?: () => void;
}) {
  const { data: settings } = useLocalCourseSettingsQuery();
  const createClassroom = useCreateClassroom50ClassroomMutation();
  const [shortName, setShortName] = useState(
    suggestClassroomShortName(settings.name, settings.startDate)
  );
  const [displayName, setDisplayName] = useState(settings.name);
  const [term, setTerm] = useState(suggestTerm(settings.startDate));

  return (
    <div className="border border-slate-600 rounded-md p-2 my-1">
      <div className="flex flex-col gap-1">
        <TextInput
          value={shortName}
          setValue={setShortName}
          label="Short name (lowercase, dashes)"
        />
        <TextInput
          value={displayName}
          setValue={setDisplayName}
          label="Display name"
        />
        <TextInput value={term} setValue={setTerm} label="Term" />
      </div>
      <div className="flex flex-row justify-end items-center gap-3 mt-2">
        {createClassroom.isPending && <Spinner />}
        <button
          disabled={createClassroom.isPending || !shortName || !displayName}
          onClick={async () => {
            const { result } = await createClassroom.mutateAsync({
              courseName: settings.name,
              org,
              shortName: shortName.trim(),
              displayName: displayName.trim(),
              term: term.trim(),
            });
            if (result.exitCode === 0) onCreated?.();
          }}
        >
          Create classroom & use it for this course
        </button>
      </div>
      {createClassroom.data && (
        <CommandResultDisplay result={createClassroom.data.result} />
      )}
    </div>
  );
}

export default function Classroom50SetupWizard({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const env = useClassroom50EnvironmentQuery();

  const envReady =
    !!env.data?.ghInstalled &&
    env.data.extensionInstalled &&
    env.data.auth.loggedIn;
  const orgs = useClassroom50OrgsQuery(envReady);
  const [selectedOrg, setSelectedOrg] = useState(
    settings.classroom50?.org ?? ""
  );
  const orgStatus = useClassroom50OrgStatusQuery(selectedOrg || undefined);

  const recheckEnvironment = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.classroom50.getEnvironmentStatus.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.classroom50.listOrgs.queryKey(),
    });
  };
  const recheckOrg = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.classroom50.getOrgStatus.queryKey(),
    });

  const adminOrgs = orgs.data?.orgs.filter((o) => o.isAdmin) ?? [];
  const otherOrgCount = (orgs.data?.orgs.length ?? 0) - adminOrgs.length;

  const auth = env.data?.ghInstalled ? env.data.auth : undefined;
  const missingScopes = auth?.missingScopes ?? [];

  return (
    <div>
      <div className="flex flex-row justify-between items-baseline">
        <h6>Setup</h6>
        <button
          className="unstyled text-sm text-slate-400 hover:text-slate-200"
          onClick={recheckEnvironment}
        >
          Re-check everything
        </button>
      </div>

      {env.isFetching && <Spinner />}
      {env.isError && (
        <div className="text-rose-300 text-sm">
          could not check the server environment: {env.error.message}
        </div>
      )}
      {env.data && (
        <>
          <CheckRow
            status={env.data.ghInstalled ? "ok" : "fail"}
            label={
              env.data.ghInstalled
                ? `GitHub CLI installed (${env.data.ghVersion})`
                : "GitHub CLI is not installed on the server"
            }
          >
            <p>
              Dev via ./run.sh: restart it — it downloads gh automatically on
              first start. Production: rebuild the docker image (it includes
              gh). Dev directly on your machine:
            </p>
            <CopyableCommand command="sudo apt install gh" />
          </CheckRow>

          {env.data.ghInstalled && (
            <>
              <CheckRow
                status={env.data.extensionInstalled ? "ok" : "fail"}
                label={
                  env.data.extensionInstalled
                    ? "gh-teacher extension installed"
                    : "gh-teacher extension is not installed"
                }
              >
                <p>
                  Dev via ./run.sh: set GH_TOKEN in .env (steps below, in the
                  sign-in row) and restart — it installs the extension
                  automatically. Otherwise, run where the server runs:
                </p>
                <CopyableCommand command="gh extension install foundation50/gh-teacher" />
              </CheckRow>

              <CheckRow
                status={
                  !auth?.loggedIn
                    ? "fail"
                    : missingScopes.length > 0
                      ? "warn"
                      : "ok"
                }
                label={
                  auth?.loggedIn
                    ? `Signed in as ${env.data.apiUser ?? auth.account}` +
                      (missingScopes.length > 0
                        ? ` — token may be missing scopes: ${missingScopes.join(", ")}`
                        : "")
                    : "Not signed in to GitHub"
                }
              >
                <GhTokenInstructions />
                <p>
                  (or, when developing directly on your machine:{" "}
                  <code>gh teacher login</code>)
                </p>
              </CheckRow>
            </>
          )}
        </>
      )}

      {envReady && (
        <div className="my-2">
          <div className="flex flex-row gap-2 items-baseline">
            <span className="w-4 text-center">
              {orgs.isFetching ? (
                <Spinner />
              ) : selectedOrg ? (
                <span className="text-emerald-300">✓</span>
              ) : (
                <span className="text-slate-400">○</span>
              )}
            </span>
            <label className="flex-1">
              GitHub organization
              <br />
              <select
                className="bg-slate-800 border border-slate-500 rounded-md px-1"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                <option value=""></option>
                {adminOrgs.map((o) => (
                  <option key={o.login} value={o.login}>
                    {o.login}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="ms-6 mt-1 text-sm text-slate-400">
            {orgs.data && adminOrgs.length === 0 && (
              <p className="text-rose-300">
                No organizations found where you are an admin.
              </p>
            )}
            {otherOrgCount > 0 && (
              <p>
                ({otherOrgCount} more org{otherOrgCount === 1 ? "" : "s"} where
                you are not an admin)
              </p>
            )}
            {!selectedOrg && (
              <p>
                Need one?{" "}
                <a
                  href={newOrgUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Create an organization
                </a>{" "}
                (free Team plan for educators via{" "}
                <a
                  href={githubEducationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  GitHub Education
                </a>
                ), then re-check.
              </p>
            )}
          </div>
        </div>
      )}

      {envReady && selectedOrg && (
        <>
          <CheckRow
            status={
              orgStatus.isFetching
                ? "pending"
                : orgStatus.data?.initialized
                  ? "ok"
                  : "fail"
            }
            label={
              orgStatus.data?.initialized
                ? `${selectedOrg} is set up for Classroom 50`
                : `${selectedOrg} has not been set up for Classroom 50 yet`
            }
          >
            <p>
              Run this once on your machine (it will walk you through creating
              a fine-grained token with Contents, Actions, Administration, and
              Members permissions):
            </p>
            <CopyableCommand command={`gh teacher init ${selectedOrg}`} />
            <button className="mt-1" onClick={recheckOrg}>
              Re-check
            </button>
          </CheckRow>

          {orgStatus.data?.initialized && (
            <div className="ms-6">
              {orgStatus.data.classrooms.length > 0 && (
                <div className="my-1">
                  <div className="text-sm text-slate-400">
                    Use an existing classroom:
                  </div>
                  <div className="flex flex-row gap-2 flex-wrap my-1">
                    {orgStatus.data.classrooms.map((c) => (
                      <button
                        key={c}
                        disabled={updateSettings.isPending}
                        onClick={async () => {
                          await updateSettings.mutateAsync({
                            ...settings,
                            classroom50: {
                              org: selectedOrg,
                              classroom: c,
                              baseUrl: settings.classroom50?.baseUrl,
                            },
                          });
                          onFinished?.();
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-slate-400">
                    or create a new one:
                  </div>
                </div>
              )}
              <CreateClassroomForm org={selectedOrg} onCreated={onFinished} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
