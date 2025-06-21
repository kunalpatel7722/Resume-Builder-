"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link as LinkIcon, Wand2 } from "lucide-react";
import type { LinkedInProfileImprovementTipsOutput } from "@/ai/flows/linkedin-profile-improvement-tips";

type ImprovementTip = LinkedInProfileImprovementTipsOutput['improvementTips'][0];

interface ImprovementTipsProps {
  tips: ImprovementTip[];
}

const ImprovementTips = ({ tips }: ImprovementTipsProps) => {
  if (!tips || tips.length === 0) {
    return (
      <div className="w-full p-4 text-center text-muted-foreground">
        No improvement tips available at the moment.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Wand2 className="text-primary h-6 w-6" />
        Your Improvement Roadmap
      </h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {tips.map((tip, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border bg-card rounded-lg px-4">
            <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
              {tip.tip}
            </AccordionTrigger>
            <AccordionContent>
               <a
                href={tip.resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <LinkIcon className="h-4 w-4" />
                Learn more
              </a>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ImprovementTips;
