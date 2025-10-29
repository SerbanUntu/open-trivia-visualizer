// Error handling

import z from "zod";
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

export const TriviaQuestionSchema = z.object({
  type: z.enum(["multiple", "boolean"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string(),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.array(z.string()),
});

export type TriviaQuestion = z.infer<typeof TriviaQuestionSchema>;

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

export const QuestionResponseSchema = z.object({
  response_code: z.number(),
  results: z.array(TriviaQuestionSchema),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
