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
    if (lowerCaseTitle.includes('content')) {
        return <PenSquare className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('format')) {
        return <Layout className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('file')) {
        return <FileText className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('ats')) {
        return <FileText className="h-6 w-6" />;
    }
    if (lowerCaseTitle.includes('tailoring')) {
        return <PenSquare className="h-6 w-6" />;
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

const ReportSection = ({ section, onClick, isActive }: ReportSectionProps) => {
  return (
    <Card 
        className={cn(
            "shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-primary",
            isActive && "border-primary shadow-lg ring-2 ring-primary/20"
        )}
        onClick={onClick}
    >
        <CardHeader className="p-4">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                    {getSectionIcon(section.title)}
                </div>
                <div className="flex-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription className="mt-1 text-xs">{section.summary}</CardDescription>
                </div>
            </div>
        </CardHeader>
    </Card>
  );
};

export default ReportSection;
