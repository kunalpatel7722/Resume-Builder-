"use client";

import { Progress } from "@/components/ui/progress";
import type { LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";

interface ScoreBreakdownProps {
  breakdown: LinkedinProfileScoreOutput['scoreBreakdown'];
}

const ScoreBreakdown = ({ breakdown }: ScoreBreakdownProps) => {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-bold">Score Breakdown</h3>
      <div className="space-y-4">
        {breakdown.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <p className="font-medium text-sm">{item.category}</p>
              <p className="font-semibold text-sm">{item.score}/100</p>
            </div>
            <Progress value={item.score} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{item.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBreakdown;
