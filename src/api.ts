import type { QuestionResponse, Result, TriviaQuestion } from "./types";
import { Err, Ok } from "./utils";

export function generateApiUrl(amount: number) {
  return `https://opentdb.com/api.php?amount=${amount}`;
}

export async function fetchQuestions(amount: number = 50): Promise<Result<TriviaQuestion[], string>> {
	const url = generateApiUrl(amount);
	const response = await fetch(url);
	if (!response.ok) {
		return Err(`An error occured. Status code ${response.status}`);
	}
	const data = await response.json();
	try {
		const result = data as QuestionResponse;
		return Ok(result.results);
	} catch (error: unknown) {
		console.error(error);
		return Err("Could not parse the JSON result");
	}
}
