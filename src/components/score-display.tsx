"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const [displayScore, setDisplayScore] = useState(0);

  const getScoreColorStyle = () => {
    if (score >= 85) return { variable: "var(--chart-2)", className: "text-chart-2" }; // Green
    if (score >= 70) return { variable: "var(--chart-4)", className: "text-chart-4" }; // Yellow
    if (score >= 50) return { variable: "var(--chart-1)", className: "text-chart-1" }; // Orange
    return { variable: "var(--destructive)", className: "text-destructive" }; // Red
  };
  
  const { variable: colorVar, className: colorClass } = getScoreColorStyle();

  useEffect(() => {
    const animationDuration = 1000;
    let start = 0;
    const end = Math.round(score);
    if (start === end) {
      setDisplayScore(end);
      return;
    }
    
    const incrementTime = (animationDuration / end) || 1;
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start >= end) {
        clearInterval(timer);
        setDisplayScore(end);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center w-full">
        <div className="flex items-baseline gap-2">
            <span className={cn("text-6xl font-bold tracking-tight", colorClass)}>{displayScore}</span>
            <span className="text-2xl font-medium text-muted-foreground">/ 100</span>
        </div>
        <Progress 
          value={score} 
          className="w-full mt-4 h-3" 
          style={{ "--primary": colorVar } as React.CSSProperties}
        />
    </div>
  );
};

export default ScoreDisplay;
