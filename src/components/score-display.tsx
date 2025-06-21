"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer
} from "@/components/ui/chart"

interface ScoreDisplayProps {
  score: number;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return "var(--chart-2)";
  if (score >= 70) return "var(--chart-4)";
  if (score >= 50) return "var(--chart-1)";
  return "var(--destructive)";
};

const getScoreMessage = (score: number) => {
  if (score >= 85) return "Excellent Profile!";
  if (score >= 70) return "Great Job!";
  if (score >= 50) return "Good Start!";
  return "Needs Improvement";
};

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const chartData = [{ name: "score", value: score, fill: `hsl(${getScoreColor(score)})` }];

  const chartConfig = {
    score: {
      label: "Score",
      color: `hsl(${getScoreColor(score)})`,
    },
  };

  return (
    <Card className="shadow-sm flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Overall Score</CardTitle>
        <CardDescription>{getScoreMessage(score)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="80%"
            outerRadius="100%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
              className="fill-[var(--color-score)]"
            />
            <g>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-5xl font-bold">
                {Math.round(score)}
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-lg">
                / 100
              </text>
            </g>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
