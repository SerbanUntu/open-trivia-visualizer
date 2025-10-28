import { useEffect, useState } from "react";
import { fetchQuestions } from "./api";
import { isErr } from "./utils";
import { type TriviaQuestion } from "./types";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

function App() {
  const [questionsAmount, setQuestionsAmount] = useState(50);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const [filter, setFilter] = useState<string | null>(null);

  const getApiData = async () => {
    const result = await fetchQuestions(questionsAmount);
    if (isErr(result)) {
      alert(result.err);
    } else {
      setQuestions(result.ok);
    }
  };

  const difficultyGrouping = Object.entries(
    questions
      .filter((q) => filter === null || q.category === filter)
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
  ).map((e) => ({ difficulty: e[0], count: e[1] }));

  const categoryGrouping = Object.entries(
    questions
      .filter((q) => filter === null || q.category === filter)
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

  useEffect(() => {
    getApiData();
  }, []);

  useEffect(() => {
    console.log(difficultyGrouping);
  });

  return (
    <main>
      <div>
        <button onClick={async () => await getApiData()}>Refetch</button>
        <input
          value={questionsAmount}
          onChange={(e) => {
            setQuestionsAmount(Number(e.target.value));
          }}
        />
      </div>
      <div>
        {categories.map((category) => (
          <button
            className="border"
            key={category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
        <button className="border" onClick={() => setFilter(null)}>
          Reset
        </button>
      </div>

      {/* Distribution by difficulty */}
      <BarChart data={difficultyGrouping} width={600} height={300}>
        <XAxis dataKey="difficulty" />
        <YAxis />
        <Bar dataKey="count" barSize={30} fill="#8884d8" />
      </BarChart>

      {/* Distribution by category */}
      {filter === null && (
        <BarChart data={categoryGrouping} width={600} height={300}>
          <XAxis dataKey="category" />
          <YAxis />
          <Bar dataKey="count" barSize={30} fill="#8884d8" />
        </BarChart>
      )}
    </main>
  );
}

export default App;
