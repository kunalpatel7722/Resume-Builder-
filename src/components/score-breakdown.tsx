"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import { cn } from "@/lib/utils";

type ScoreBreakdownData = LinkedinProfileScoreOutput['scoreBreakdown'];

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownData;
}

const getScoreStyle = (score: number): React.CSSProperties => {
  if (score >= 80) { // Great
    return { backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))' };
  }
  if (score >= 70) { // Good
    return { backgroundColor: 'hsl(var(--chart-4))', color: 'hsl(var(--foreground))' };
  }
  if (score >= 50) { // Medium
    return { backgroundColor: 'hsl(var(--chart-1))', color: 'hsl(var(--primary-foreground))' };
  }
  // Low
  return { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' };
};

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className="flex items-center justify-center w-12 h-7 rounded-md font-bold text-sm"
      style={getScoreStyle(score)}
    >
      {score}
    </div>
  );
};


const ScoreBreakdown = ({ breakdown }: ScoreBreakdownProps) => {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Accordion type="single" collapsible defaultValue={breakdown.length > 0 ? breakdown[0].title : undefined} className="w-full space-y-3">
        {breakdown.map((category) => (
          <AccordionItem value={category.title} key={category.title} className="border-b-0 border rounded-lg bg-card shadow-sm data-[state=open]:shadow-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline text-left rounded-lg">
              <div className="flex items-center justify-between w-full">
                <p className="font-semibold text-base text-foreground">{category.title}</p>
                <ScoreBadge score={category.score} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-4 border-t pt-4">{category.feedback}</p>
              <div className="space-y-3">
                {category.checks.map((check, checkIndex) => (
                  <div key={checkIndex} className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                    {check.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm text-foreground">{check.check}</p>
                      <p className="text-xs text-muted-foreground">{check.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ScoreBreakdown;
