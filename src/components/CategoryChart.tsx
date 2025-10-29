import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import Button from "./Button";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ArrowUpZA,
  ArrowDownZA,
} from "lucide-react";
import useWindow from "../hooks/use-window";
import {
  getSortedCategoryGrouping,
  type SortingOptions,
} from "../lib/data-processing";
import type { CategoryGrouping } from "../lib/types";
import { updateUrlSearchParams } from "../lib/utils";

/**
 * The maximum device width in pixels at which the tick width of the y-axis should be reduced.
 */
const TICK_WIDTH_DEVICE_BREAKPOINT_PIXELS = 480;

/**
 * A custom tooltip component for showing information about
 * each bar in the category chart.
 *
 * @property active - Whether the tooltip is active.
 * @property payload - The information about the data point at the current bar.
 * @property label - The label of the data point at the current bar.
 */
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<string | number, string>) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-card max-w-40 border-2 border-border text-foreground p-3 rounded-sm shadow-lg">
        <p className="text-muted">{label}</p>
        <p className="text-foreground">{`${payload[0].value} question${
          payload[0].value === 1 ? "" : "s"
        }`}</p>
      </div>
    );
  }
  return null;
};

const sanitizeSortingOptions = (
  sortTypeParam: string | null,
  sortOrderParam: string | null
): SortingOptions => {
  let sortType = "name";
  let sortOrder = "asc";
  if (sortTypeParam === "count") sortType = "count";
  if (sortOrderParam === "desc") sortOrder = "desc";
  return [sortType as "name" | "count", sortOrder as "asc" | "desc"];
};

/**
 * A category chart component that displays the number of questions corresponding to each trivia category.
 * Includes buttons for sorting the categories by name or count.
 *
 * @property categoryGrouping - The grouping of categories by name and count.
 */
export default function CategoryChart({
  categoryGrouping,
}: {
  categoryGrouping: CategoryGrouping[];
}) {
  const searchParams = new URLSearchParams(window.location.search);
  const sortTypeParam = searchParams.get("sort-type");
  const sortOrderParam = searchParams.get("sort-order");

  const [sortBy, setSortBy] = useState<SortingOptions>(
    sanitizeSortingOptions(sortTypeParam, sortOrderParam)
  );
  const { width } = useWindow();

  const sortedCategoryGrouping = useMemo(() => {
    return getSortedCategoryGrouping(categoryGrouping, sortBy);
  }, [categoryGrouping, sortBy]);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("sort-type", sortBy[0]);
    currentParams.set("sort-order", sortBy[1]);
    updateUrlSearchParams(currentParams);
  }, [sortBy]);

  return (
    <div className="w-full flex flex-col gap-2">
      <p>Select a sorting option:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          isPrimary={sortBy[0] === "name"}
          onClick={() => {
            const [sortType, sortOrder] = sortBy;
            if (sortType === "name") {
              setSortBy(["name", sortOrder === "asc" ? "desc" : "asc"]);
            } else {
              setSortBy(["name", sortOrder]);
            }
          }}
        >
          {sortBy[1] === "asc" ? (
            <ArrowDownZA className="inline mr-2" />
          ) : (
            <ArrowUpZA className="inline mr-2" />
          )}
          Sort by name
        </Button>
        <Button
          isPrimary={sortBy[0] === "count"}
          onClick={() => {
            const [sortType, sortOrder] = sortBy;
            if (sortType === "count") {
              setSortBy(["count", sortOrder === "asc" ? "desc" : "asc"]);
            } else {
              setSortBy(["count", sortOrder]);
            }
          }}
        >
          {sortBy[1] === "asc" ? (
            <ArrowDownWideNarrow className="inline mr-2" />
          ) : (
            <ArrowUpWideNarrow className="inline mr-2" />
          )}
          Sort by count
        </Button>
      </div>
      <BarChart
        layout="vertical"
        className="mt-8"
        data={sortedCategoryGrouping}
        width={Math.min(600, width - 64)}
        height={800}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis type="number" tick={{ fill: "var(--foreground)" }} />
        <YAxis
          dataKey="category"
          type="category"
          tick={{
            fontSize: width > TICK_WIDTH_DEVICE_BREAKPOINT_PIXELS ? 16 : 12,
            fill: "var(--foreground)",
          }}
          width={width > TICK_WIDTH_DEVICE_BREAKPOINT_PIXELS ? 200 : 100}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: "var(--foreground)", opacity: 0.05 }}
          content={CustomTooltip}
        />
        <Bar dataKey="count" barSize={30} fill="var(--primary)" />
      </BarChart>
    </div>
  );
}
