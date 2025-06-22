"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface SectionDetailContentProps {
  checks: {
    title: string;
    status: 'pass' | 'fail' | 'warning';
    summary: string;
    details: string;
  }[];
}

const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
  switch (status) {
    case 'pass':
      return <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />;
    case 'fail':
      return <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
  }
};

const SectionDetailContent = ({ checks }: SectionDetailContentProps) => {
  return (
    <div className="space-y-6">
      {checks.map((check, index) => (
        <div key={index} className="flex items-start gap-4">
            {getStatusIcon(check.status)}
            <div>
                <h4 className="font-semibold text-foreground leading-snug">{check.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">{check.details}</p>
            </div>
        </div>
      ))}
    </div>
  );
};

export default SectionDetailContent;
