"use client";
import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/features/local/course/localCoursesHooks";
import {
  defaultClassroom50BaseUrl,
  getClassroom50ClassPageUrl,
  getClassroom50LocalCommands,
} from "@/features/local/classroom50/classroom50UrlUtils";
import {
  useClassroom50StatusQuery,
  useSyncClassroom50RosterMutation,
} from "@/features/local/classroom50/classroom50Hooks";
import TextInput from "@/components/form/TextInput";
import CopyableCommand from "@/components/CopyableCommand";
import CommandResultDisplay from "@/components/CommandResultDisplay";
import LocalGhSetupNote from "@/components/LocalGhSetupNote";
import { Spinner } from "@/components/Spinner";
import { useState } from "react";
import { settingsBox } from "./sharedSettings";
import Classroom50SetupWizard, {
  CreateClassroomForm,
} from "./Classroom50SetupWizard";
import Classroom50AuthHelp from "./Classroom50AuthHelp";
import { RosterSyncSummaryData } from "@/features/local/classroom50/classroom50Types";
import { isAuthFailureResult } from "@/features/local/classroom50/classroom50SetupUtils";

function Classroom50Status() {
  const statusQuery = useClassroom50StatusQuery();
  if (statusQuery.isLoading)
    return <div className="text-slate-500">checking classroom...</div>;
  if (statusQuery.isError)
    return (
      <div className="text-rose-300">
        could not check classroom: {statusQuery.error.message}
      </div>
    );
  const status = statusQuery.data;
  if (!status || !status.configured) return null;
  // an unauthenticated server also "cannot find" the classroom, so say which
  // one it is instead of sending them off to check the org and short name
  if (status.results.some(isAuthFailureResult))
    return (
      <div className="text-rose-300">
        {status.ghTokenSet
          ? "GitHub rejected the server's GH_TOKEN"
          : "the server has no GH_TOKEN"}
      </div>
    );
  if (!status.classroomFound)
    return (
      <div className="text-rose-300">
        classroom not found on GitHub, check the org / short name
      </div>
    );
  return (
    <div className="text-emerald-300">
      classroom found — {status.assignmentSlugs.length} assignment
      {status.assignmentSlugs.length === 1 ? "" : "s"}
      {typeof status.rosterCount === "number" &&
        `, ${status.rosterCount} student${
          status.rosterCount === 1 ? "" : "s"
        } in roster`}
    </div>
  );
}

function ManualConfigForm() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const [org, setOrg] = useState(settings.classroom50?.org ?? "");
  const [classroom, setClassroom] = useState(
    settings.classroom50?.classroom ?? ""
  );
  const [baseUrl, setBaseUrl] = useState(settings.classroom50?.baseUrl ?? "");

  const classPageUrl = getClassroom50ClassPageUrl(settings);
  const hasUnsavedChanges =
    org !== (settings.classroom50?.org ?? "") ||
    classroom !== (settings.classroom50?.classroom ?? "") ||
    baseUrl !== (settings.classroom50?.baseUrl ?? "");

  return (
    <>
      <div className="flex flex-col gap-1">
        <TextInput value={org} setValue={setOrg} label="GitHub Organization" />
        <TextInput
          value={classroom}
          setValue={setClassroom}
          label="Classroom Short Name"
        />
        <TextInput
          value={baseUrl}
          setValue={setBaseUrl}
          label={`Classroom 50 URL (blank for ${defaultClassroom50BaseUrl})`}
        />
      </div>
      <div className="flex flex-row gap-3 justify-end items-center mt-3">
        {updateSettings.isPending && <Spinner />}
        {classPageUrl && (
          <a
            className="btn"
            href={classPageUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in Classroom 50
          </a>
        )}
        <button
          disabled={!hasUnsavedChanges || updateSettings.isPending}
          onClick={() =>
            updateSettings.mutate({
              ...settings,
              classroom50:
                org && classroom
                  ? {
                      org: org.trim(),
                      classroom: classroom.trim(),
                      baseUrl: baseUrl.trim() || undefined,
                    }
                  : undefined,
            })
          }
        >
          Save
        </button>
      </div>
    </>
  );
}

function RosterSyncSummary({
  data,
  rosterPageUrl,
}: {
  data: RosterSyncSummaryData;
  rosterPageUrl?: string;
}) {
  if (data.rosterResult.exitCode !== 0)
    return <CommandResultDisplay result={data.rosterResult} />;
  const failedUpdates = data.updateResults.filter((r) => r.exitCode !== 0);
  return (
    <div className="border border-slate-600 rounded-md p-2 my-2 text-sm">
      <div>
        {data.rosterCount} student{data.rosterCount === 1 ? "" : "s"} in the
        classroom roster
        {data.updated.length > 0 &&
          ` — updated from Canvas: ${data.updated.join(", ")}`}
      </div>
      {data.unmatchedRoster.length > 0 && (
        <div className="text-slate-400 mt-1">
          In the classroom but not matched to a Canvas email (add their email
          in{" "}
          {rosterPageUrl ? (
            <a
              href={rosterPageUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              the roster page
            </a>
          ) : (
            "the roster page"
          )}{" "}
          to match them): {data.unmatchedRoster.join(", ")}
        </div>
      )}
      {data.unmatchedCanvas.length > 0 && (
        <div className="mt-1">
          <div className="text-slate-400">
            {data.unmatchedCanvas.length} Canvas student
            {data.unmatchedCanvas.length === 1 ? "" : "s"} not in the classroom
            yet — send them an assignment accept link, or add them by email on
            the roster page:
          </div>
          <CopyableCommand
            command={data.unmatchedCanvas
              .map((s) => s.email || `(no email: ${s.name})`)
              .join("\n")}
          />
        </div>
      )}
      {failedUpdates.map((result) => (
        <CommandResultDisplay key={result.command} result={result} />
      ))}
    </div>
  );
}

function ConfiguredActions() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const syncRoster = useSyncClassroom50RosterMutation();
  const statusQuery = useClassroom50StatusQuery();
  const localCommands = getClassroom50LocalCommands(settings);

  const status = statusQuery.data?.configured ? statusQuery.data : undefined;
  const notAuthenticated =
    (status?.results.some(isAuthFailureResult) ?? false) ||
    isAuthFailureResult(syncRoster.data?.rosterResult);
  const classroomMissing = !!status && !status.classroomFound;

  return (
    <>
      <hr className="my-3 border-slate-600" />
      <div className="flex flex-row gap-3 items-center flex-wrap">
        <Classroom50Status />
        <div className="flex-1" />
        {syncRoster.isPending && <Spinner />}
        <button
          disabled={syncRoster.isPending}
          onClick={() => syncRoster.mutate(settings.name)}
        >
          Sync Roster with Canvas
        </button>
      </div>
      <p className="text-slate-500 text-sm">
        Students join the classroom by accepting an assignment link. Sync
        matches classroom members to Canvas students by email, fills in their
        names, and reports who has not joined yet.
      </p>
      {syncRoster.data && (
        <RosterSyncSummary
          data={syncRoster.data}
          rosterPageUrl={
            getClassroom50ClassPageUrl(settings)
              ? `${getClassroom50ClassPageUrl(settings)}/roster`
              : undefined
          }
        />
      )}

      {notAuthenticated && (
        <Classroom50AuthHelp ghTokenSet={status?.ghTokenSet} />
      )}

      {classroomMissing && !notAuthenticated && settings.classroom50 && (
        <div className="mt-2">
          <div className="text-slate-400 text-sm">
            New semester? Create this semester&apos;s classroom in{" "}
            {settings.classroom50.org} and switch this course to it:
          </div>
          <CreateClassroomForm org={settings.classroom50.org} />
        </div>
      )}

      {localCommands && (
        <div className="mt-3">
          <div className="text-slate-500 text-sm">
            Run on your machine (needs gh + the gh-teacher extension):
          </div>
          <CopyableCommand
            command={localCommands.audit}
            note="Check org security settings"
          />
          <CopyableCommand
            command={localCommands.init}
            note="One-time org bootstrap (needs a fine-grained PAT)"
          />
          <LocalGhSetupNote />
        </div>
      )}
    </>
  );
}

export default function Classroom50Settings() {
  const { data: settings } = useLocalCourseSettingsQuery();
  const [mode, setMode] = useState<"wizard" | "manual">(
    settings.classroom50 ? "manual" : "wizard"
  );

  return (
    <div className={settingsBox}>
      <div className="flex flex-row items-baseline">
        <div className="flex-1" />
        <h5 className="text-center">Classroom 50</h5>
        <div className="flex-1 text-end">
          <button
            className="unstyled text-sm text-slate-400 hover:text-slate-200"
            onClick={() => setMode(mode === "wizard" ? "manual" : "wizard")}
          >
            {mode === "wizard" ? "enter settings manually" : "setup wizard"}
          </button>
        </div>
      </div>
      <p className="text-center text-slate-500">
        Connects this course to a classroom in your GitHub organization
      </p>

      {mode === "wizard" ? (
        <Classroom50SetupWizard onFinished={() => setMode("manual")} />
      ) : (
        <>
          <ManualConfigForm
            key={JSON.stringify(settings.classroom50 ?? null)}
          />
          {settings.classroom50 && <ConfiguredActions />}
        </>
      )}
    </div>
  );
}
