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
  extractedText: z.string().describe("The full text extracted from the provided LinkedIn profile data that was used for the analysis."),
});

export type LinkedinProfileScoreOutput = z.infer<typeof LinkedinProfileScoreOutputSchema>;

export async function linkedinProfileScore(input: LinkedinProfileScoreInput): Promise<LinkedinProfileScoreOutput> {
  return linkedinProfileScoreFlow(input);
}

const linkedinProfileScorePrompt = ai.definePrompt({
  name: 'linkedinProfileScorePrompt',
  input: {schema: LinkedinProfileScoreInputSchema},
  output: {schema: LinkedinProfileScoreOutputSchema},
  prompt: `You are an expert LinkedIn profile optimizer. Given the following LinkedIn profile data, your task is to first extract the text content from it, then analyze the extracted text to provide a comprehensive evaluation.

Profile Data: {{{profileData}}}

1.  **Extract Text**: Thoroughly extract all textual content from the provided profile data.
2.  **Analyze and Score**: Based on the extracted text, assess the profile's completeness and effectiveness. Provide an overall score out of 100.
3.  **Provide Breakdown**: Give a detailed breakdown of the score across the following categories:
    *   Keyword Usage
    *   Profile Completeness (summary, skills, experience, education)
    *   Headline and Summary Quality
    *   Overall Presentation
    For each category, provide a score (out of 100) and specific feedback.
4.  **Suggest Improvements**: Provide a list of general improvement tips.
5.  **Format Output**: Return a single JSON object containing:
    *   'score': The overall score (0-100).
    *   'scoreBreakdown': An array of objects with 'category', 'score', and 'feedback'.
    *   'improvementTips': An array of strings with improvement suggestions.
    *   'extractedText': The full, unmodified text you extracted in step 1.
`,
});

const linkedinProfileScoreFlow = ai.defineFlow(
  {
    name: 'linkedinProfileScoreFlow',
    inputSchema: LinkedinProfileScoreInputSchema,
    outputSchema: LinkedinProfileScoreOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const { output } = await linkedinProfileScorePrompt(input);
        return output!;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for linkedinProfileScoreFlow:`, error);
        if (i === maxRetries - 1) {
          // If this was the last attempt, re-throw the error
          throw error;
        }
        // Wait for a short period before retrying (e.g., exponential backoff)
        const delay = Math.pow(2, i) * 1000; // 1s, 2s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    // This should be unreachable
    throw new Error('Flow failed after all retries.');
  }
);
