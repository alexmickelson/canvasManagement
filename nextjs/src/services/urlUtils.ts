export function getModuleItemUrl(
  courseName: string,
  moduleName: string,
  type: "assignment" | "page" | "quiz",
  itemName: string
) {
  return (
    "/course/" +
    encodeURIComponent(courseName) +
    "/modules/" +
    encodeURIComponent(moduleName) +
    `/${type}/` +
    encodeURIComponent(itemName)
  );
}
export function getLectureUrl(courseName: string, lectureDate: string) {
  return (
    "/course/" +
    encodeURIComponent(courseName) +
    "/lecture/" +
    encodeURIComponent(lectureDate)
  );
}
export function getLecturePreviewUrl(courseName: string, lectureDate: string) {
  return getLectureUrl(courseName, lectureDate) + "/preview";
}

export function getCourseUrl(courseName: string) {
  return "/course/" + encodeURIComponent(courseName);
}

export function getCourseSettingsUrl(courseName: string) {
  return "/course/" + encodeURIComponent(courseName) + "/settings";
}
