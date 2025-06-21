"use client";

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type ScoreBreakdown = {
  title: string;
  score: number;
}[];

interface ScoreBreakdownChartProps {
  data: ScoreBreakdown;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--chart-2))";
    if (score >= 70) return "hsl(var(--chart-4))";
    if (score >= 50) return "hsl(var(--chart-1))";
    return "hsl(var(--destructive))";
};

const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="font-bold text-foreground">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ScoreBreakdownChart = ({ data }: ScoreBreakdownChartProps) => {
    const chartData = data.map(item => ({
        name: item.title,
        score: item.score,
    }));

    const longestLabelLength = Math.max(...data.map(item => item.title.length));
    const yAxisWidth = Math.min(Math.max(longestLabelLength * 6, 80), 150);

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle>Score Breakdown</CardTitle>
                <CardDescription>
                    Your score across different analysis categories.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))"/>
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} stroke="hsl(var(--border))"/>
                            <YAxis
                                dataKey="name"
                                type="category"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                width={yAxisWidth}
                                interval={0}
                            />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--muted))' }}
                                content={<CustomTooltipContent />}
                            />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScoreBreakdownChart;
