'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface OverallScoreDisplayProps {
  score: number;
  summary: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getScoreRingColor = (score: number) => {
  if (score >= 80) return 'ring-green-100';
  if (score >= 50) return 'ring-yellow-100';
  return 'ring-red-100';
}

const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
}

const getScoreLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Great";
  if (score >= 70) return "Good";
  if (score >= 50) return "Average";
  return "Needs Improvement";
}


const OverallScoreDisplay = ({ score, summary }: OverallScoreDisplayProps) => {
  const scorePercentage = `${score}%`;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="relative h-28 w-28 md:h-32 md:w-32 flex-shrink-0">
          <svg className="h-full w-full" viewBox="0 0 100 100">
            <circle
              className="text-muted/50"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className={cn('transform -rotate-90 origin-center', getScoreTextColor(score))}
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
            <span className="text-3xl md:text-4xl font-bold text-foreground">{score}</span>
          </div>
        </div>
        <div className="text-center md:text-left">
            <Badge className={cn("mb-2", getScoreColor(score))}>{getScoreLabel(score)}</Badge>
            <h2 className="text-lg md:text-xl font-semibold text-foreground">Overall Score</h2>
            <p className="text-sm text-muted-foreground mt-1">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallScoreDisplay;
