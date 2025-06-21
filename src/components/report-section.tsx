"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Layout, PenSquare, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface ReportSectionProps {
  section: {
    title: string;
    score: number;
    summary: string;
    checks: {
      title: string;
      status: 'pass' | 'fail' | 'warning';
      summary: string;
      details: string;
    }[];
  };
}

const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'fail':
      return <XCircle className="h-5 w-5 text-destructive" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
};

const getSectionIcon = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('content')) {
        return <PenSquare className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('format')) {
        return <Layout className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('file')) {
        return <FileText className="h-6 w-6" />;
    }
    // Default icons for LinkedIn sections
    if (lowerCaseTitle.includes('headline')) {
        return <PenSquare className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('experience')) {
        return <Layout className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('skills')) {
        return <FileText className="h-6 w-6" />;
    }
     if (lowerCaseTitle.includes('completeness')) {
        return <CheckCircle2 className="h-6 w-6" />;
    }
    return <PenSquare className="h-6 w-6" />;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-destructive";
};

const ReportSection = ({ section }: ReportSectionProps) => {
  return (
    <Card className="shadow-sm">
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="p-6 text-left hover:no-underline">
                    <div className="flex items-start md:items-center gap-4 w-full">
                        <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-lg">
                            {getSectionIcon(section.title)}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-xl">{section.title}</CardTitle>
                            <CardDescription className="mt-1">{section.summary}</CardDescription>
                        </div>
                         <div className="hidden md:block">
                            <span className={cn("text-2xl font-bold", getScoreColor(section.score))}>
                                {section.score}/100
                            </span>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="px-6 pb-6 pt-0">
                      <div className="space-y-4 border-t pt-4">
                        {section.checks.map((check, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(check.status)}
                                <h4 className="font-semibold text-foreground">{check.title}</h4>
                            </div>
                            <p className="text-muted-foreground text-sm ml-8">{check.summary}</p>
                            <p className="text-muted-foreground/80 text-xs ml-8 mt-1">{check.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
  );
};

export default ReportSection;
