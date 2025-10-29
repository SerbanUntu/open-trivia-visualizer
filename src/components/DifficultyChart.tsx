import { Cell, Legend, Pie, PieChart, ResponsiveContainer, type PieLabelRenderProps } from "recharts";

const COLORS = {
  easy: "#00C49F",
  medium: "#FFBB28",
  hard: "#FF8042",
};

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
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

export default function DifficultyChart({
  difficultyGrouping,
}: {
  difficultyGrouping: {
    difficulty: "easy" | "medium" | "hard";
    count: number;
  }[];
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
