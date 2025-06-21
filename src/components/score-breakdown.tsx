"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import type { LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";

type ScoreBreakdownData = LinkedinProfileScoreOutput['scoreBreakdown'];

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownData;
}

const ScoreBreakdown = ({ breakdown }: ScoreBreakdownProps) => {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={breakdown.length > 0 ? [breakdown[0].title] : []} className="w-full space-y-3">
        {breakdown.map((category) => (
          <AccordionItem value={category.title} key={category.title} className="border rounded-lg shadow-sm data-[state=open]:shadow-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline text-left">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-1">
                  <p className="font-semibold text-base">{category.title}</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className="font-bold text-lg text-foreground">{category.score}</span>
                   <Progress value={category.score} className="w-20 h-2" />
                </div>
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
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
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
