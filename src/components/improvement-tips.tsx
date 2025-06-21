"use client";

import type { LinkedinProfileScoreOutput } from "@/ai/flows/linkedin-profile-score";
import type { ResumeAtsCheckOutput } from "@/ai/flows/resume-ats-check";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type AiSuggestionsData = LinkedinProfileScoreOutput['aiSuggestions'] | ResumeAtsCheckOutput['aiSuggestions'];

interface AiSuggestionsProps {
  suggestions: AiSuggestionsData;
}

const ImprovementTips = ({ suggestions }: AiSuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          Top AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                    <h3 className="font-bold text-base text-foreground">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovementTips;
