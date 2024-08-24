import { LocalAssignment } from "./assignmnet/localAssignment";
import { IModuleItem } from "./IModuleItem";
import { LocalCoursePage } from "./page/localCoursePage";
import { LocalQuiz } from "./quiz/localQuiz";
import { getDateFromString } from "./timeUtils";

export interface LocalModule {
  name: string;
  assignments: LocalAssignment[];
  quizzes: LocalQuiz[];
  pages: LocalCoursePage[];
}

export const LocalModuleUtils = {
  getSortedModuleItems(module: LocalModule): IModuleItem[] {
    return [...module.assignments, ...module.quizzes, ...module.pages].sort(
      (a, b) =>
        (getDateFromString(a.dueAt)?.getTime() ?? 0) -
        (getDateFromString(b.dueAt)?.getTime() ?? 0)
    );
  },

  equals(module1: LocalModule, module2: LocalModule): boolean {
    return (
      module1.name.toLowerCase() === module2.name.toLowerCase() &&
      LocalModuleUtils.compareCollections(
        module1.assignments.sort((a, b) => a.name.localeCompare(b.name)),
        module2.assignments.sort((a, b) => a.name.localeCompare(b.name))
      ) &&
      LocalModuleUtils.compareCollections(
        module1.quizzes.sort((a, b) => a.name.localeCompare(b.name)),
        module2.quizzes.sort((a, b) => a.name.localeCompare(b.name))
      ) &&
      LocalModuleUtils.compareCollections(
        module1.pages.sort((a, b) => a.name.localeCompare(b.name)),
        module2.pages.sort((a, b) => a.name.localeCompare(b.name))
      )
    );
  },

  compareCollections<T>(first: T[], second: T[]): boolean {
    if (first.length !== second.length) return false;

    for (let i = 0; i < first.length; i++) {
      if (JSON.stringify(first[i]) !== JSON.stringify(second[i])) return false;
    }

    return true;
  },

  getHashCode(module: LocalModule): number {
    const hash = new Map<string, number>();
    hash.set(module.name.toLowerCase(), 1);
    LocalModuleUtils.addRangeToHash(
      hash,
      module.assignments.sort((a, b) => a.name.localeCompare(b.name))
    );
    LocalModuleUtils.addRangeToHash(
      hash,
      module.quizzes.sort((a, b) => a.name.localeCompare(b.name))
    );
    LocalModuleUtils.addRangeToHash(
      hash,
      module.pages.sort((a, b) => a.name.localeCompare(b.name))
    );

    return Array.from(hash.values()).reduce((acc, val) => acc + val, 0);
  },

  addRangeToHash<T>(hash: Map<string, number>, items: T[]): void {
    for (const item of items) {
      hash.set(JSON.stringify(item), 1);
    }
  },
};
