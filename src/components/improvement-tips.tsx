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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Sparkles className="mr-3 h-6 w-6 text-primary" />
          Top AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 h-7 w-7 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="font-bold text-base">{index + 1}</span>
                </div>
                <div>
                    <h3 className="font-bold text-md text-foreground">{suggestion.title}</h3>
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
