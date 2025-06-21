
"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface CategoryScoreIndicatorProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "hsl(var(--chart-2))"; // Green
  if (score >= 70) return "hsl(var(--chart-4))"; // Yellow
  if (score >= 50) return "hsl(var(--chart-1))"; // Orange
  return "hsl(var(--destructive))"; // Red
};

const CategoryScoreIndicator = ({ score }: CategoryScoreIndicatorProps) => {
  const chartData = [{ name: "score", value: score, fill: getScoreColor(score) }];

  const chartConfig = {
    score: {
      label: "Score",
      color: getScoreColor(score),
    },
  };

  return (
    <div className="w-12 h-12">
        <ChartContainer
            config={chartConfig}
            className="w-full h-full aspect-square"
        >
            <RadialBarChart
                data={chartData}
                startAngle={90}
                endAngle={-270}
                innerRadius="70%"
                outerRadius="100%"
                barSize={8}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                    dataKey="value"
                    background={{ fill: 'hsl(var(--muted))' }}
                    cornerRadius={4}
                    className="fill-[var(--color-score)]"
                />
                <g>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-sm font-bold">
                        {Math.round(score)}
                    </text>
                </g>
            </RadialBarChart>
        </ChartContainer>
    </div>
  );
};

export default CategoryScoreIndicator;
