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
  prompt: `You are an expert LinkedIn profile optimizer. Given the following LinkedIn profile data, assess its completeness and effectiveness, and provide a score out of 100. Also, provide a list of improvement tips.

Profile Data: {{{profileData}}}

Consider factors such as:
* Keyword usage
* Profile completeness (summary, skills, experience, education)
* Endorsements and recommendations
* Headline and summary quality
* Use of industry-relevant terms
* Overall presentation

Output a JSON object with a 'score' (0-100) and 'improvementTips' (array of strings).
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
