"use client";

import type { ResumeAtsCheckOutput } from "@/ai/flows/resume-ats-check";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Star } from "lucide-react";

type KeywordAnalysisData = ResumeAtsCheckOutput['keywordAnalysis'];

interface KeywordAnalysisProps {
  data: KeywordAnalysisData;
}

const KeywordAnalysis = ({ data }: KeywordAnalysisProps) => {
  if (!data) {
    return null;
  }

  const matchPercentage = Math.round(
    (data.foundKeywords.length / (data.foundKeywords.length + data.missingKeywords.length)) * 100
  ) || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                <Star className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="text-xl font-semibold">Keyword & Skill Match</CardTitle>
                <CardDescription>
                  Your resume has a {matchPercentage}% keyword match with the job description.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-base text-foreground flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Keywords Found
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.foundKeywords.length > 0 ? (
                data.foundKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">No matching keywords were found in your resume.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-base text-foreground flex items-center mb-3">
            <XCircle className="h-5 w-5 text-destructive mr-2" />
            Missing Keywords
          </h3>
          <p className="text-sm text-muted-foreground mb-3">Consider adding these critical keywords from the job description to improve your match rate.</p>
          <div className="flex flex-wrap gap-2">
             {data.missingKeywords.length > 0 ? (
                data.missingKeywords.map((keyword, index) => (
                    <Badge key={index} variant="destructive">{keyword}</Badge>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">Great work! All critical keywords from the job description were found.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeywordAnalysis;
