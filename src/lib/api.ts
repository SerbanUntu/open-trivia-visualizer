import {
  QuestionResponseSchema,
  type QuestionResponse,
  type TriviaQuestion,
} from "./types";
import { Err, Ok, decodeHtml, type Result } from "./utils";

/**
 * Generates the URL for the API request to fetch trivia questions from the Open Trivia Database.
 *
 * @param amount - The number of trivia questions to fetch (up to 50).
 * @returns The URL for the API request.
 */
export function generateApiUrl(amount: number) {
  return `https://opentdb.com/api.php?amount=${amount}`;
}

/**
 * Fetches trivia questions from the Open Trivia Database, and returns the parsed result.
 *
 * @param amount - The number of trivia questions to fetch (up to 50).
 * @returns The trivia questions, or an error message if the request failed.
 */
export async function fetchQuestions(
  amount: number = 50
): Promise<Result<TriviaQuestion[], string>> {
  if (amount < 1 || amount > 50) {
    return Err("Amount of trivia questions must be between 1 and 50 inclusive");
  }
  const url = generateApiUrl(amount);
  const response = await fetch(url);
  if (!response.ok) {
    return Err(`An error occured. Status code ${response.status}`);
  }
  try {
    const data = await response.json();
    const result: QuestionResponse = QuestionResponseSchema.parse(data);
    const parsedQuestions: TriviaQuestion[] = result.results.map((q) => {
      return {
        ...q,
        category: decodeHtml(q.category),
        question: decodeHtml(q.question),
        correct_answer: decodeHtml(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtml),
      };
    });
    return Ok(parsedQuestions);
  } catch (error: unknown) {
    console.error(error);
    return Err("Could not parse the JSON result");
  }
}
