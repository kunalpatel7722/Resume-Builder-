"use client";

import type { LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type ImprovementTipsData = LinkedinProfileScoreOutput['improvementTips'];

interface ImprovementTipsProps {
  tips: ImprovementTipsData;
}

const ImprovementTips = ({ tips }: ImprovementTipsProps) => {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          Top Improvements to Make
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="font-bold text-xs">{index + 1}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-md text-foreground">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementTips;
