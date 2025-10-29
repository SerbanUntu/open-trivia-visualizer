import { useEffect, useState } from "react";
import { fetchQuestions } from "./api";
import { isErr } from "./utils";
import { type TriviaQuestion } from "./types";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import useWindow from "./hooks/use-window";

function App() {
  const [questionsAmount, setQuestionsAmount] = useState(50);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const [filter, setFilter] = useState<string | null>(null);
  const { width } = useWindow();

  const chartWidth = Math.min(600, width - 64);
  const chartHeight = chartWidth / 2;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-background overflow-x-hidden text-foreground w-screen min-h-screen flex justify-center">
      <div className="p-8 overflow-x-hidden w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="flex flex-wrap gap-2">
          <label>Number of questions:</label>
          <input
            type="number"
            className="border-border border-2 px-2 rounded-md"
            value={questionsAmount}
            onChange={(e) => {
              setQuestionsAmount(Number(e.target.value));
            }}
          />
          <button
            className="px-3 text-white hover:opacity-75 cursor-pointer transition-all duration-200 py-0.5 rounded-sm bg-primary"
            onClick={async () => await getApiData()}
          >
            Refetch
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <p>Select a filter:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) =>
              filter === category ? (
                <button
                  className="px-3 text-white hover:opacity-75 cursor-pointer transition-all duration-200 py-0.5 rounded-sm border-primary border-2 bg-primary"
                  key={category}
                  onClick={() => setFilter(null)}
                >
                  {category}
                </button>
              ) : (
                <button
                  className="px-3 text-white hover:opacity-75 cursor-pointer transition-all duration-200 py-0.5 rounded-sm border-muted border-2 bg-none"
                  key={category}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* Distribution by difficulty */}
        <BarChart
          data={difficultyGrouping}
          width={chartWidth}
          height={chartHeight}
        >
          <XAxis dataKey="difficulty" />
          <YAxis />
          <Bar dataKey="count" barSize={30} fill="#8884d8" />
        </BarChart>

        {/* Distribution by category */}
        {filter === null && (
          <BarChart
            data={categoryGrouping}
            width={chartWidth}
            height={chartHeight}
          >
            <XAxis dataKey="category" />
            <YAxis />
            <Bar dataKey="count" barSize={30} fill="#8884d8" />
          </BarChart>
        )}
      </div>
    </main>
  );
}

export default App;
