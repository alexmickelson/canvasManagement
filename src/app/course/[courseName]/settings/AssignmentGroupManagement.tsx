"use client";

import {
  useLocalCourseSettingsQuery,
  useUpdateLocalCourseSettingsMutation,
} from "@/hooks/localCourse/localCoursesHooks";
import { LocalAssignmentGroup } from "@/models/local/assignment/localAssignmentGroup";
import { useEffect, useState } from "react";
import TextInput from "../../../../components/form/TextInput";
import { useSetAssignmentGroupsMutation } from "@/hooks/canvas/canvasCourseHooks";
import { settingsBox } from "./sharedSettings";
import { Spinner } from "@/components/Spinner";
import { baseCanvasUrl } from "@/services/canvas/canvasServiceUtils";
import MeatballIcon from "./MeatballIcon";

export default function AssignmentGroupManagement() {
  const [settings, { isPending }] = useLocalCourseSettingsQuery();
  const updateSettings = useUpdateLocalCourseSettingsMutation();
  const applyInCanvas = useSetAssignmentGroupsMutation(settings.canvasId);

  const [assignmentGroups, setAssignmentGroups] = useState<
    LocalAssignmentGroup[]
  >(settings.assignmentGroups);

  useEffect(() => {
    const delay = 1000;
    const handler = setTimeout(() => {
      if (
        !areAssignmentGroupsEqual(assignmentGroups, settings.assignmentGroups)
      ) {
        console.log(
          "updating",
          assignmentGroups,
          updateSettings.isPending,
          isPending
        );
        updateSettings.mutate({
          settings: {
            ...settings,
            assignmentGroups,
          },
        });
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [assignmentGroups, isPending, settings, updateSettings]);

  return (
    <div className={settingsBox}>
      {assignmentGroups.map((group) => (
        <div key={group.id} className="flex flex-row gap-3">
          <TextInput
            value={group.name}
            setValue={(newValue) =>
              setAssignmentGroups((oldGroups) =>
                oldGroups.map((g) =>
                  g.id === group.id ? { ...g, name: newValue } : g
                )
              )
            }
            label={"Group Name"}
          />
          <TextInput
            value={group.weight.toString()}
            setValue={(newValue) =>
              setAssignmentGroups((oldGroups) =>
                oldGroups.map((g) =>
                  g.id === group.id
                    ? { ...g, weight: parseInt(newValue || "0") }
                    : g
                )
              )
            }
            label={"Weight"}
          />
        </div>
      ))}
      <div className="flex gap-3 mt-3">
        <button
          className="btn-danger"
          onClick={() => {
            setAssignmentGroups((oldGroups) => oldGroups.slice(0, -1));
          }}
        >
          Remove Assignment Group
        </button>
        <button
          onClick={() => {
            setAssignmentGroups((oldGroups) => [
              ...oldGroups,
              {
                id: Date.now().toString(),
                name: "",
                weight: 0,
              },
            ]);
          }}
        >
          Add Assignment Group
        </button>
      </div>
      <br />
      <div className="flex justify-end">
        <button
          onClick={async () => {
            const newSettings = await applyInCanvas.mutateAsync(settings);

            // prevent debounce from resetting
            if (newSettings) setAssignmentGroups(newSettings.assignmentGroups);
          }}
          disabled={applyInCanvas.isPending}
        >
          Update Assignment Groups In Canvas
        </button>
      </div>
      {applyInCanvas.isPending && <Spinner />}
      {applyInCanvas.isSuccess && (
        <div>
          {"You will need to go to your course assignments page "}
          <a
            href={`${baseCanvasUrl}/courses/${settings.canvasId}/assignments`}
            className="font-bold underline hover:scale-115"
            target="_blank"
          >
            HERE
          </a>
          {" > settings ("}
          <MeatballIcon />
          {")  > Assignment Group Weights"}
          <br />
          {"and check the 'Weight final grade based on assignment groups' box"}
          <br />
        </div>
      )}
    </div>
  );
}

function areAssignmentGroupsEqual(
  list1: LocalAssignmentGroup[],
  list2: LocalAssignmentGroup[]
): boolean {
  // Check if lists have the same length
  if (list1.length !== list2.length) return false;

  // Sort both lists by the unique 'id' or 'canvasId' as a fallback
  const sortedList1 = [...list1].sort((a, b) => {
    if (a.id !== b.id) return a.id > b.id ? 1 : -1;
    if (a.canvasId !== b.canvasId) return (a.canvasId || 0) - (b.canvasId || 0);
    return 0;
  });

  const sortedList2 = [...list2].sort((a, b) => {
    if (a.id !== b.id) return a.id > b.id ? 1 : -1;
    if (a.canvasId !== b.canvasId) return (a.canvasId || 0) - (b.canvasId || 0);
    return 0;
  });

  // Deep compare each object in the sorted lists
  for (let i = 0; i < sortedList1.length; i++) {
    const group1 = sortedList1[i];
    const group2 = sortedList2[i];

    if (
      group1.id !== group2.id ||
      group1.name !== group2.name ||
      group1.weight !== group2.weight ||
      group1.canvasId !== group2.canvasId
    ) {
      return false;
    }
  }

  return true;
}
