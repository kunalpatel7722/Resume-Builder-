"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, FileText, Layout, PenSquare, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface ReportSectionProps {
  section: {
    title: string;
    score: number;
    summary: string;
  };
  onClick: () => void;
  isActive: boolean;
}

const getSectionIcon = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('content') || lowerCaseTitle.includes('tailoring')) {
        return <PenSquare className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('format') || lowerCaseTitle.includes('experience')) {
        return <Layout className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('ats') || lowerCaseTitle.includes('skills')) {
        return <FileText className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('headline')) {
        return <PenSquare className="h-6 w-6" />;
    }
     if (lowerCaseTitle.includes('completeness')) {
        return <CheckCircle2 className="h-6 w-6" />;
    }
    return <PenSquare className="h-6 w-6" />;
};

const ReportSection = ({ section, onClick, isActive }: ReportSectionProps) => {
  return (
    <Card 
        className={cn(
            "cursor-pointer transition-all hover:bg-secondary",
            isActive && "bg-secondary border-primary"
        )}
        onClick={onClick}
    >
        <CardHeader className="p-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                    {getSectionIcon(section.title)}
                </div>
                <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
                </div>
                <div className="text-lg font-bold text-foreground">
                    {section.score}
                </div>
            </div>
        </CardHeader>
    </Card>
  );
};

export default ReportSection;
