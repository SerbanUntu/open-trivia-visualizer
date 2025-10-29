import { useEffect, useState } from "react";
import { fetchQuestions } from "./api";
import { capitalize, isErr } from "./utils";
import { type TriviaQuestion } from "./types";
import useWindow from "./hooks/use-window";
import DifficultyChart from "./components/DifficultyChart";
import CategoryChart from "./components/CategoryChart";
import Button from "./components/Button";
import ThemeToggle from "./components/ThemeToggle";

const CHART_TYPES = ["category", "difficulty"];

function App() {
  const [questionsAmount, setQuestionsAmount] = useState(50);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [currentChart, setCurrentChart] =
    useState<(typeof CHART_TYPES)[number]>("difficulty");
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

  return (
    <main className="bg-background overflow-x-hidden text-foreground w-screen min-h-screen flex justify-center">
      <div className="p-8 overflow-x-hidden w-full max-w-3xl flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">Open Trivia DB Visualizer</h1>
          <ThemeToggle />
        </div>
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
          <Button isPrimary={true} onClick={async () => await getApiData()}>
            Refetch
          </Button>
        </div>
        {isLoading ? (
          <p className="text-muted">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-muted">No data to show.</p>
        ) : (
          <>
            <div className="flex flex-col gap-2 w-full">
              <p>Select a category filter:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    isPrimary={filter === category}
                    onClick={() => {
                      if (filter === null) {
                        setFilter(category);
                        setCurrentChart("difficulty");
                      } else {
                        setFilter(null);
                      }
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p>
                Select a chart:
                {filter && (
                  <span>
                    {" "}
                    (Cannot group by category when a category filter is applied)
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {CHART_TYPES.map((chartType) => (
                  <Button
                    key={chartType}
                    isPrimary={currentChart === chartType}
                    disabled={
                      isLoading || (chartType === "category" && filter !== null)
                    }
                    onClick={() => setCurrentChart(chartType)}
                  >
                    {capitalize(chartType)}
                  </Button>
                ))}
              </div>
            </div>

            {currentChart === "difficulty" && (
              <DifficultyChart difficultyGrouping={difficultyGrouping} />
            )}
            {currentChart === "category" && (
              <CategoryChart
                categoryGrouping={categoryGrouping}
                chartWidth={chartWidth}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default App;
