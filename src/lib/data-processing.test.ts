import { describe, test, expect } from "vitest";
import MOCK_QUESTIONS from "./test-questions.json";
import {
  getSortedCategoryGrouping,
  groupByCategory,
  groupByDifficulty,
} from "./data-processing";
import { QuestionResponseSchema } from "./types";

const questions = QuestionResponseSchema.parse(MOCK_QUESTIONS).results;

describe("grouping functions", () => {
  test("groupByCategory should group questions by category", () => {
    const result = groupByCategory(questions);
    expect(result).toEqual([
      { category: "General Knowledge", count: 6 },
      { category: "Science & Nature", count: 7 },
      { category: "History", count: 7 },
      { category: "Geography", count: 6 },
      { category: "Entertainment: Film", count: 3 },
      { category: "Science: Computers", count: 5 },
      { category: "Sports", count: 3 },
      { category: "Science: Mathematics", count: 4 },
      { category: "Entertainment: Music", count: 3 },
      { category: "Entertainment: Video Games", count: 2 },
      { category: "Art", count: 2 },
      { category: "Mythology", count: 2 },
      { category: "Entertainment: Television", count: 1 },
    ]);
  });

  test("groupByDifficulty should group questions by difficulty", () => {
    const result = groupByDifficulty(questions);
    expect(result).toEqual([
      { difficulty: "easy", count: 15 },
      { difficulty: "medium", count: 23 },
      { difficulty: "hard", count: 13 },
    ]);
  });

  test("groupByCategory can handle zero questions", () => {
    const result = groupByCategory([]);
    expect(result).toEqual([]);
  });

  test("groupByDifficulty can handle zero questions", () => {
    const result = groupByDifficulty([]);
    expect(result).toEqual([
      {
        difficulty: "easy",
        count: 0,
      },
      {
        difficulty: "medium",
        count: 0,
      },
      {
        difficulty: "hard",
        count: 0,
      },
    ]);
  });
});

describe("sorting functions", () => {
  test("getSortedCategoryGrouping should sort by name in ascending order", () => {
    const result = getSortedCategoryGrouping(groupByCategory(questions), [
      "name",
      "asc",
    ]);
    expect(result).toEqual([
      { category: "Art", count: 2 },
      { category: "Entertainment: Film", count: 3 },
      { category: "Entertainment: Music", count: 3 },
      { category: "Entertainment: Television", count: 1 },
      { category: "Entertainment: Video Games", count: 2 },
      { category: "General Knowledge", count: 6 },
      { category: "Geography", count: 6 },
      { category: "History", count: 7 },
      { category: "Mythology", count: 2 },
      { category: "Science & Nature", count: 7 },
      { category: "Science: Computers", count: 5 },
      { category: "Science: Mathematics", count: 4 },
      { category: "Sports", count: 3 },
    ]);
  });

  test("getSortedCategoryGrouping should sort by name in descending order", () => {
    const result = getSortedCategoryGrouping(groupByCategory(questions), [
      "name",
      "desc",
    ]);
    expect(result).toEqual([
      { category: "Sports", count: 3 },
      { category: "Science: Mathematics", count: 4 },
      { category: "Science: Computers", count: 5 },
      { category: "Science & Nature", count: 7 },
      { category: "Mythology", count: 2 },
      { category: "History", count: 7 },
      { category: "Geography", count: 6 },
      { category: "General Knowledge", count: 6 },
      { category: "Entertainment: Video Games", count: 2 },
      { category: "Entertainment: Television", count: 1 },
      { category: "Entertainment: Music", count: 3 },
      { category: "Entertainment: Film", count: 3 },
      { category: "Art", count: 2 },
    ]);
  });

  test("getSortedCategoryGrouping should sort by count in ascending order and by name in ascending order", () => {
    const result = getSortedCategoryGrouping(groupByCategory(questions), [
      "count",
      "asc",
    ]);
    expect(result).toEqual([
      { category: "Entertainment: Television", count: 1 },
      { category: "Art", count: 2 },
      { category: "Entertainment: Video Games", count: 2 },
      { category: "Mythology", count: 2 },
      { category: "Entertainment: Film", count: 3 },
      { category: "Entertainment: Music", count: 3 },
      { category: "Sports", count: 3 },
      { category: "Science: Mathematics", count: 4 },
      { category: "Science: Computers", count: 5 },
      { category: "General Knowledge", count: 6 },
      { category: "Geography", count: 6 },
      { category: "History", count: 7 },
      { category: "Science & Nature", count: 7 },
    ]);
  });

  test("getSortedCategoryGrouping should sort by count in descending order and by name in descending order", () => {
    const result = getSortedCategoryGrouping(groupByCategory(questions), [
      "count",
      "desc",
    ]);
    expect(result).toEqual([
      { category: "Science & Nature", count: 7 },
      { category: "History", count: 7 },
      { category: "Geography", count: 6 },
      { category: "General Knowledge", count: 6 },
      { category: "Science: Computers", count: 5 },
      { category: "Science: Mathematics", count: 4 },
      { category: "Sports", count: 3 },
      { category: "Entertainment: Music", count: 3 },
      { category: "Entertainment: Film", count: 3 },
      { category: "Mythology", count: 2 },
      { category: "Entertainment: Video Games", count: 2 },
      { category: "Art", count: 2 },
      { category: "Entertainment: Television", count: 1 },
    ]);
  });

  test("getSortedCategoryGrouping can handle zero questions", () => {
    const result = getSortedCategoryGrouping([], ["name", "asc"]);
    expect(result).toEqual([]);
  });
});
