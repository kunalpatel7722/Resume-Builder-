'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface OverallScoreDisplayProps {
  score: number;
  summary: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Great";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
}

const OverallScoreDisplay = ({ score, summary }: OverallScoreDisplayProps) => {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className="relative h-40 w-40">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="text-secondary"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className={cn('transform -rotate-90 origin-center transition-all duration-500', getScoreColor(score))}
              strokeWidth="10"
              strokeDasharray={`${score * 2.83}, 283`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-foreground">{score}</span>
            <span className="text-sm font-medium text-muted-foreground">out of 100</span>
          </div>
        </div>
        <div className="text-center">
            <Badge className={cn("mb-2 text-sm", getScoreBadgeColor(score))}>{getScoreLabel(score)}</Badge>
            <h2 className="text-xl font-semibold text-foreground">Overall Score</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallScoreDisplay;
