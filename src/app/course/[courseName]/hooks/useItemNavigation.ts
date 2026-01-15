import { useOrderedCourseItems } from "./useOrderedCourseItems";
import { getNavigationLinks, CourseItemType } from "./navigationLogic";

export function useItemNavigation(
  type: CourseItemType,
  name: string,
  moduleName?: string
) {
  const { orderedItems, orderedLectures } = useOrderedCourseItems();

  const list = type === "lecture" ? orderedLectures : orderedItems;

  return getNavigationLinks(list, type, name, moduleName);
}
