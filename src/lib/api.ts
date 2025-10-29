import {
  QuestionResponseSchema,
  type QuestionResponse,
  type TriviaQuestion,
} from "./types";
import { Err, Ok, decodeHtml, type Result } from "./utils";

export function generateApiUrl(amount: number) {
  return `https://opentdb.com/api.php?amount=${amount}`;
}

export async function fetchQuestions(
  amount: number = 50
): Promise<Result<TriviaQuestion[], string>> {
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
