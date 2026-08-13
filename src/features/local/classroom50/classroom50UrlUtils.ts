import { LocalAssignment } from "../assignments/models/localAssignment";
import { LocalCourseSettings } from "../course/localCourseSettings";

export const classroomUrlToken = "insert_classroom_url";
// legacy token from the GitHub Classroom integration, still present in older
// markdown files; resolves to the same Classroom 50 accept url
export const legacyClassroomUrlToken = "insert_github_classroom_url";

export const defaultClassroom50BaseUrl = "https://classroom50.org";

export const getClassroom50ClassPageUrl = (
  settings: LocalCourseSettings
): string | undefined => {
  if (!settings.classroom50) return undefined;
  const { org, classroom, baseUrl } = settings.classroom50;
  if (!org || !classroom) return undefined;
  const base = (baseUrl || defaultClassroom50BaseUrl).replace(/\/+$/, "");
  return `${base}/${org}/${classroom}`;
};

export const getClassroom50AcceptUrl = (
  settings: LocalCourseSettings,
  slug: string | undefined
): string | undefined => {
  const classPageUrl = getClassroom50ClassPageUrl(settings);
  if (!classPageUrl || !slug) return undefined;
  return `${classPageUrl}/assignments/${slug}`;
};

// commands meant to be copied and run on the faculty machine, not the server
export const getClassroom50LocalCommands = (
  settings: LocalCourseSettings,
  slug?: string
) => {
  if (!settings.classroom50) return undefined;
  const { org, classroom } = settings.classroom50;
  return {
    downloadSubmissions: slug
      ? `gh teacher download ${org} ${classroom} ${slug} -d ./grading/${slug}`
      : undefined,
    audit: `gh teacher audit ${org}`,
    init: `gh teacher init ${org}`,
  };
};

export const getClassroomReplaceText = ({
  assignment,
  settings,
  strict = false,
}: {
  assignment: Pick<LocalAssignment, "classroom50Slug">;
  settings: LocalCourseSettings;
  strict?: boolean;
}) => {
  const acceptUrl =
    getClassroom50AcceptUrl(settings, assignment.classroom50Slug) ?? "";
  return [
    { source: classroomUrlToken, destination: acceptUrl, strict },
    { source: legacyClassroomUrlToken, destination: acceptUrl, strict },
  ];
};
