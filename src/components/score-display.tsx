"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [strokeOffset, setStrokeOffset] = useState(0);

  const getScoreColorClass = () => {
    if (score >= 85) return "text-chart-2"; // Green
    if (score >= 70) return "text-chart-4"; // Yellow
    if (score >= 50) return "text-chart-1"; // Orange
    return "text-destructive"; // Red
  };

  const getScoreMessage = () => {
    if (score >= 85) return "Excellent Profile!";
    if (score >= 70) return "Great Job!";
    if (score >= 50) return "Good Start!";
    return "Needs Improvement";
  };

  const circumference = 2 * Math.PI * 52; // 2 * pi * r

  useEffect(() => {
    const animationDuration = 1500; // ms
    
    // Animate score count up
    let start = 0;
    const end = Math.round(score);
    if (start === end) return;
    
    const incrementTime = (animationDuration / end);
    const timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start === end) {
        clearInterval(timer);
        setDisplayScore(end);
      }
    }, incrementTime);

    // Set final stroke offset for CSS transition
    const finalOffset = circumference - (score / 100) * circumference;
    // We set it to full circumference first, then to final value to trigger animation
    setStrokeOffset(circumference);
    setTimeout(() => setStrokeOffset(finalOffset), 100);

    return () => clearInterval(timer);
  }, [score, circumference]);

  return (
    <Card>
        <CardHeader className="items-center pb-2">
            <CardTitle>Profile Score</CardTitle>
            <CardDescription>{getScoreMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-muted/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                <circle
                    className={cn("origin-center -rotate-90", getScoreColorClass())}
                    style={{ strokeDasharray: circumference, strokeDashoffset: strokeOffset, transition: 'stroke-dashoffset 1.5s ease-out' }}
                    strokeWidth="8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-foreground">{displayScore}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
