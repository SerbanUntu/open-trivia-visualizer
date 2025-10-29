import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import type { DifficultyGrouping } from "../lib/types";

const COLORS = {
  easy: "#00C49F",
  medium: "#FFBB28",
  hard: "#FF8042",
};

const RADIAN = Math.PI / 180;

/**
 * A label for showing the count and percentage of a difficulty inside a pie slice.
 *
 * @property cx - The x coordinate of the center of the pie.
 * @property cy - The y coordinate of the center of the pie.
 * @property midAngle - The angle of the current pie slice.
 * @property innerRadius - The inner radius of the pie.
 * @property outerRadius - The outer radius of the pie.
 * @property percent - The percentage of the current pie slice, out of the whole.
 * @property name - The name of the current pie slice (the difficulty).
 */
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: PieLabelRenderProps) => {
  // @ts-expect-error type unknown https://github.com/recharts/recharts/issues/6380
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  // @ts-expect-error type unknown https://github.com/recharts/recharts/issues/6380
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  // @ts-expect-error type unknown https://github.com/recharts/recharts/issues/6380
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  if (name === "0") {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontWeight="bold"
      textAnchor={x > (cx ?? 0) ? "start" : "end"}
      dominantBaseline="central"
    >
      {/* @ts-expect-error type unknown https://github.com/recharts/recharts/issues/6380 */}
      {`${name} (${((percent ?? 1) * 100).toFixed(0)}%)`}
    </text>
  );
};

/**
 * A difficulty chart component that displays the number of questions corresponding to each difficulty.
 *
 * @property difficultyGrouping - The grouping of difficulties by name and count.
 */
export default function DifficultyChart({
  difficultyGrouping,
}: {
  difficultyGrouping: DifficultyGrouping[];
}) {
  return (
    <div style={{ width: "100%", maxWidth: "500px" }}>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Legend />
          <Pie
            data={difficultyGrouping}
            nameKey="difficulty"
            dataKey="count"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {difficultyGrouping.map((grouping) => (
              <Cell
                key={grouping.difficulty}
                fill={COLORS[grouping.difficulty]}
                name={grouping.count.toString()}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
