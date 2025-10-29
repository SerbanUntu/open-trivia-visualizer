import { useEffect, useMemo, useState } from "react";
import { fetchQuestions } from "./lib/api";
import { capitalize, isErr } from "./lib/utils";
import { type TriviaQuestion } from "./lib/types";
import DifficultyChart from "./components/DifficultyChart";
import CategoryChart from "./components/CategoryChart";
import Button from "./components/Button";
import ThemeToggle from "./components/ThemeToggle";
import { groupByCategory, groupByDifficulty } from "./lib/data-processing";

const CHART_TYPES = ["category", "difficulty"];

function App() {
  const [questionsAmount, setQuestionsAmount] = useState(50);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [currentChart, setCurrentChart] =
    useState<(typeof CHART_TYPES)[number]>("difficulty");

  const categories = Array.from(
    new Set(questions.map((q) => q.category))
  ).sort();

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

  const filteredQuestions = useMemo(() => {
    if (filter === null) return questions;
    return questions.filter((q) => q.category === filter);
  }, [questions, filter]);

  const difficultyGrouping = useMemo(
    () => groupByDifficulty(filteredQuestions),
    [filteredQuestions]
  );
  const categoryGrouping = useMemo(
    () => groupByCategory(filteredQuestions),
    [filteredQuestions]
  );

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-background overflow-x-hidden text-foreground w-screen min-h-screen flex justify-center">
      <div className="p-8 overflow-x-hidden w-full max-w-3xl flex flex-col items-center gap-8">
        <header className="flex items-center gap-2">
          <h1 className="font-bold text-2xl">Open Trivia DB Visualizer</h1>
          <ThemeToggle />
        </header>
        <main className="flex flex-col gap-8 w-full items-center">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await getApiData();
            }}
            className="flex flex-wrap gap-2 items-center"
          >
            <label
              htmlFor="api-questions-fetch-amount"
              className="leading-none"
            >
              Number of questions:
            </label>
            <input
              id="api-questions-fetch-amount"
              type="number"
              className="border-border border-2 px-2 min-w-32 py-0.5 rounded-md"
              min={1}
              max={50}
              value={questionsAmount}
              onChange={(e) => {
                setQuestionsAmount(Number(e.target.value));
              }}
            />
            <Button isPrimary={true} type="submit" disabled={isLoading}>
              {isLoading ? "Fetching..." : "Refetch"}
            </Button>
          </form>
          {isLoading ? (
            <p className="text-muted">Loading...</p>
          ) : questions.length === 0 ? (
            <p className="text-muted">No data to show.</p>
          ) : (
            <>
              <div className="flex flex-col gap-2 w-full">
                <p>
                  Select a category filter:
                  {filter && (
                    <span className="text-muted">
                      {" "}
                      (Press the same filter again to remove it)
                    </span>
                  )}
                </p>
                <menu className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      isPrimary={filter === category}
                      onClick={() => {
                        if (filter === null || filter !== category) {
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
                </menu>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <p>
                  Select a chart:
                  {filter && (
                    <span className="text-muted">
                      {" "}
                      (Cannot group by category when a category filter is
                      applied)
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {CHART_TYPES.map((chartType) => (
                    <Button
                      key={chartType}
                      isPrimary={currentChart === chartType}
                      disabled={
                        isLoading ||
                        (chartType === "category" && filter !== null)
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
                <CategoryChart categoryGrouping={categoryGrouping} />
              )}
            </>
          )}
        </main>
        <footer className="text-sm mt-4 text-muted flex flex-col items-center gap-2">
          <p>
            The source code is available on{" "}
            <a
              className="hover:underline text-primary"
              href="https://github.com/SerbanUntu/open-trivia-visualizer"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
          <p>
            Data provided by the{" "}
            <a
              className="hover:underline text-primary"
              href="https://opentdb.com/api_config.php"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Trivia DB API
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
