// Error handling

import { Err, Ok } from "./utils";

export type Result<T, E> =
  | {
      ok: T;
      err?: never;
    }
  | {
      ok?: never;
      err: E;
    };

// API Types

export type TriviaCategory = {
  id: number;
  name: string;
};

export type CategoryResponse = {
  trivia_categories: TriviaCategory[];
};

export type TriviaQuestion = {
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type OpentdbResponseCode =
  | "SUCCESS"
  | "NO_RESULTS"
  | "INVALID_PARAMETER"
  | "TOKEN_NOT_FOUND"
  | "TOKEN_EMPTY"
  | "RATE_LIMIT";

export function getResponseCodeFromNumber(
  code: number
): Result<OpentdbResponseCode, string> {
  switch (code) {
    case 0:
      return Ok("SUCCESS");
    case 1:
      return Ok("NO_RESULTS");
    case 2:
      return Ok("INVALID_PARAMETER");
    case 3:
      return Ok("TOKEN_NOT_FOUND");
    case 4:
      return Ok("TOKEN_EMPTY");
    case 5:
      return Ok("RATE_LIMIT");
    default:
      return Err(
        "Invalid response code. API response codes are from 0 to 5 inclusive."
      );
  }
}

export type QuestionResponse = {
  response_code: number;
  results: TriviaQuestion[];
};
