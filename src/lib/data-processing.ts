import type {
  CategoryGrouping,
  DifficultyGrouping,
  TriviaQuestion,
} from "./types";

export type SortingOptions = ["name" | "count", "asc" | "desc"];

export const getSortedCategoryGrouping = (
  categoryGrouping: CategoryGrouping[],
  sortingOptions: SortingOptions
): CategoryGrouping[] => {
  const [sortType, sortOrder] = sortingOptions;
  if (categoryGrouping.length === 0) return [];
  const sortedAlphabetically = [...categoryGrouping].sort((a, b) => {
    return sortOrder === "asc"
      ? a.category.localeCompare(b.category)
      : b.category.localeCompare(a.category);
  });
  if (sortType === "name") return sortedAlphabetically;
  return [...sortedAlphabetically].sort((a, b) => {
    return sortOrder === "asc" ? a.count - b.count : b.count - a.count;
  });
};

export const groupByCategory = (
  questions: TriviaQuestion[]
): CategoryGrouping[] => {
  return Object.entries(
    questions
      .map((q) => q.category)
      .reduce((a, c) => {
        if (c in a) {
          a[c] += 1;
        } else {
          a[c] = 1;
        }
        return a;
      }, {} as { [key: string]: number })
  ).map((e) => ({ category: e[0], count: e[1] }));
};

export const groupByDifficulty = (
  questions: TriviaQuestion[]
): DifficultyGrouping[] => {
  return Object.entries(
    questions
      .map((q) => q.difficulty)
      .reduce(
        (a, c) => {
          if (c === "easy" || c === "medium" || c === "hard") {
            a[c] += 1;
          }
          return a;
        },
        {
          easy: 0,
          medium: 0,
          hard: 0,
        }
      )
  ).map((e) => ({
    difficulty: e[0] as "easy" | "medium" | "hard",
    count: e[1],
  }));
};
