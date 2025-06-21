// src/ai/flows/linkedin-profile-improvement-tips.ts
'use server';

/**
 * @fileOverview Generates personalized and actionable tips to improve a LinkedIn profile.
 *
 * - getLinkedInProfileImprovementTips - A function that returns improvement tips for the LinkedIn profile.
 * - LinkedInProfileImprovementTipsInput - The input type for the getLinkedInProfileImprovementTips function.
 * - LinkedInProfileImprovementTipsOutput - The return type for the getLinkedInProfileImprovementTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedInProfileImprovementTipsInputSchema = z.object({
  profileText: z.string().describe('The text content of the LinkedIn profile.'),
  profileScore: z.number().describe('The overall LinkedIn profile score.'),
});

export type LinkedInProfileImprovementTipsInput = z.infer<typeof LinkedInProfileImprovementTipsInputSchema>;

const LinkedInProfileImprovementTipsOutputSchema = z.object({
  improvementTips: z.array(
    z.object({
      tip: z.string().describe('A specific, actionable tip to improve the LinkedIn profile.'),
      resourceLink: z.string().describe('A link to a resource that helps implement the tip.'),
    })
  ).describe('An array of improvement tips with resource links.'),
});

export type LinkedInProfileImprovementTipsOutput = z.infer<typeof LinkedInProfileImprovementTipsOutputSchema>;

export async function getLinkedInProfileImprovementTips(input: LinkedInProfileImprovementTipsInput): Promise<LinkedInProfileImprovementTipsOutput> {
  return linkedInProfileImprovementTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkedInProfileImprovementTipsPrompt',
  input: {schema: LinkedInProfileImprovementTipsInputSchema},
  output: {schema: LinkedInProfileImprovementTipsOutputSchema},
  prompt: `You are a LinkedIn expert providing personalized and actionable tips to improve a user's LinkedIn profile.

  Based on the following LinkedIn profile text and score, provide at least three improvement tips with links to resources that help implement the tip.

  LinkedIn Profile Text: {{{profileText}}}
  Profile Score: {{{profileScore}}}

  Format your response as a JSON object with an array of improvementTips. Each tip should have a 'tip' and a 'resourceLink'.
  `,
});

const linkedInProfileImprovementTipsFlow = ai.defineFlow(
  {
    name: 'linkedInProfileImprovementTipsFlow',
    inputSchema: LinkedInProfileImprovementTipsInputSchema,
    outputSchema: LinkedInProfileImprovementTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
