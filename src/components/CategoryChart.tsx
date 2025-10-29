import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import Button from "./Button";
import { useMemo, useState } from "react";
import {
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ArrowUpZA,
  ArrowDownZA,
} from "lucide-react";
import useWindow from "../hooks/use-window";

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

export default function CategoryChart({
  categoryGrouping,
}: {
  categoryGrouping: {
    category: string;
    count: number;
  }[];
  chartWidth: number;
}) {
  const [sortBy, setSortBy] = useState<["name" | "count", "asc" | "desc"]>([
    "name",
    "asc",
  ]);
  const { width } = useWindow();

  const sortedCategoryGrouping = useMemo(() => {
    const [sortType, sortOrder] = sortBy;
    if (categoryGrouping.length === 0) return [];
    return [...categoryGrouping].sort((a, b) => {
      if (sortType === "name") {
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      return sortOrder === "asc" ? a.count - b.count : b.count - a.count;
    });
  }, [categoryGrouping, sortBy]);

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
        data={sortedCategoryGrouping}
        width={Math.min(600, width - 64)}
        height={800}
      >
        <XAxis type="number" />
        <YAxis
          dataKey="category"
          type="category"
          tick={{ fontSize: width > 480 ? 16 : 12 }}
          width={width > 480 ? 200 : 100}
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
