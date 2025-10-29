import { useEffect, useState } from "react";
import { fetchQuestions } from "./api";
import { isErr } from "./utils";
import { type TriviaQuestion } from "./types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import useWindow from "./hooks/use-window";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-gray-800 text-white p-3 rounded-xl shadow-lg">
        <p className="text-primary">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function App() {
  const [questionsAmount, setQuestionsAmount] = useState(50);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const { width } = useWindow();

  const categories = Array.from(
    new Set(questions.map((q) => q.category))
  ).sort();

  const chartWidth = Math.min(600, width - 64);
  // const chartHeight = chartWidth / 2;

  const getApiData = async () => {
    setIsLoading(true);
    const result = await fetchQuestions(questionsAmount);
    setIsLoading(false);
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
  ).map((e) => ({
    difficulty: e[0] as "easy" | "medium" | "hard",
    count: e[1],
  }));

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

  const COLORS = {
    easy: "#00C49F",
    medium: "#FFBB28",
    hard: "#FF8042",
  };

  return (
    <main className="bg-background overflow-x-hidden text-foreground w-screen min-h-screen flex justify-center">
      <div className="p-8 overflow-x-hidden w-full max-w-3xl flex flex-col items-center gap-8">
        <h1 className="font-bold text-2xl">Open Trivia DB Visualizer</h1>
        <div className="flex flex-wrap gap-2">
          <label htmlFor="api-questions-fetch-amount">
            Number of questions:
          </label>
          <input
            id="api-questions-fetch-amount"
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
        {isLoading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <>
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

            <h2 className="text-xl font-bold">Distribution by difficulty</h2>
            <div style={{ width: "100%", maxWidth: "500px" }}>
              <ResponsiveContainer width="100%" height={chartWidth}>
                <PieChart>
                  <Legend />
                  <Pie
                    data={difficultyGrouping}
                    nameKey="difficulty"
                    dataKey="count"
                    labelLine={false}
                  >
                    {difficultyGrouping.map((grouping) => (
                      <Cell
                        key={grouping.difficulty}
                        fill={COLORS[grouping.difficulty]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {filter === null && (
              <>
                <h2 className="text-xl font-bold">Distribution by category</h2>
                <BarChart
                  layout="vertical"
                  data={categoryGrouping}
                  width={chartWidth}
                  height={Math.max(800, chartWidth)}
                  margin={{
                    left: 100,
                  }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip
                    cursor={{ fill: "var(--foreground)", opacity: 0.1 }}
                    content={CustomTooltip}
                  />
                  <Bar dataKey="count" barSize={30} fill="var(--primary)" />
                </BarChart>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default App;
