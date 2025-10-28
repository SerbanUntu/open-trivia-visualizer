import { useEffect, useState } from "react";
import { fetchQuestions } from "./api";
import { isErr } from "./utils";
import { type TriviaQuestion } from "./types";

function App() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);

	useEffect(() => {
    const getApiData = async () => {
      const result = await fetchQuestions();
      if (isErr(result)) {
        alert(result.err);
      } else {
        setQuestions(result.ok);
      }
    };

    getApiData();
  }, []);

  return (
    <main>
      <ul>
        {questions.map((question) => (
          <li key={question.question}>{question.question}</li>
        ))}
      </ul>
    </main>
  );
}

export default App;
