'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring a LinkedIn profile.
 *
 * - linkedinProfileScore -  A function that processes a LinkedIn profile (via PDF or URL) and returns a score (out of 100) indicating its completeness and effectiveness.
 * - LinkedinProfileScoreInput - The input type for the linkedinProfileScore function.
 * - LinkedinProfileScoreOutput - The return type for the linkedinProfileScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedinProfileScoreInputSchema = z.object({
  profileData: z.string().describe("The LinkedIn profile data, either as a PDF data URI or a URL to the profile."),
});

export type LinkedinProfileScoreInput = z.infer<typeof LinkedinProfileScoreInputSchema>;

const LinkedinProfileScoreOutputSchema = z.object({
  score: z.number().describe("A score (out of 100) indicating the completeness and effectiveness of the LinkedIn profile."),
  scoreBreakdown: z.array(z.object({
    category: z.string().describe("The category being scored, e.g., 'Keyword Usage', 'Profile Completeness'."),
    score: z.number().describe("The score for this category (out of 100)."),
    feedback: z.string().describe("Specific feedback for this category."),
  })).describe("A detailed breakdown of the profile score across different categories."),
  improvementTips: z.array(z.string()).describe("A list of improvement tips for the LinkedIn profile."),
});

export type LinkedinProfileScoreOutput = z.infer<typeof LinkedinProfileScoreOutputSchema>;

export async function linkedinProfileScore(input: LinkedinProfileScoreInput): Promise<LinkedinProfileScoreOutput> {
  return linkedinProfileScoreFlow(input);
}

const linkedinProfileScorePrompt = ai.definePrompt({
  name: 'linkedinProfileScorePrompt',
  input: {schema: LinkedinProfileScoreInputSchema},
  output: {schema: LinkedinProfileScoreOutputSchema},
  prompt: `You are an expert LinkedIn profile optimizer. Given the following LinkedIn profile data, assess its completeness and effectiveness.

Profile Data: {{{profileData}}}

Provide an overall score out of 100. Also, provide a detailed breakdown of the score across the following categories:
* Keyword Usage
* Profile Completeness (summary, skills, experience, education)
* Headline and Summary Quality
* Overall Presentation

For each category in the breakdown, provide a score (out of 100) and specific feedback.
Finally, provide a list of general improvement tips.

Output a JSON object with a 'score' (0-100), 'scoreBreakdown' (an array of objects with 'category', 'score', and 'feedback'), and 'improvementTips' (array of strings).
`,
});

const linkedinProfileScoreFlow = ai.defineFlow(
  {
    name: 'linkedinProfileScoreFlow',
    inputSchema: LinkedinProfileScoreInputSchema,
    outputSchema: LinkedinProfileScoreOutputSchema,
  },
  async input => {
    const {output} = await linkedinProfileScorePrompt(input);
    return output!;
  }
);
