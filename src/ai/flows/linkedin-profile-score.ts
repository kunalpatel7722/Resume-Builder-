'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring a LinkedIn profile.
 *
 * - linkedinProfileScore -  A function that processes a LinkedIn profile (via PDF or URL) and returns a detailed score and analysis.
 * - LinkedinProfileScoreInput - The input type for the linkedinProfileScore function.
 * - LinkedinProfileScoreOutput - The return type for the linkedinProfileScoreOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedinProfileScoreInputSchema = z.object({
  profileData: z.string().describe("The LinkedIn profile data, either as a PDF data URI or a URL to the profile."),
});

export type LinkedinProfileScoreInput = z.infer<typeof LinkedinProfileScoreInputSchema>;

const ScoreCategorySchema = z.object({
  title: z.string().describe("The title of the category, e.g., 'Headline' or 'Experience Section'."),
  score: z.number().describe("The score for this category (out of 100)."),
  feedback: z.string().describe("Overall feedback for this category, summarizing what's good and what can be improved."),
  checks: z.array(z.object({
    check: z.string().describe("A specific check performed within this category, e.g., 'Is your headline between 8-15 words long?'"),
    passed: z.boolean().describe("Whether the profile passed this specific check."),
    details: z.string().describe("A short explanation of why this check passed or failed and how to improve it."),
  })).describe("A list of specific checks and their results for this category."),
});

const LinkedinProfileScoreOutputSchema = z.object({
  overallScore: z.number().describe("The overall score for the LinkedIn profile, from 0 to 100."),
  summaryFeedback: z.string().describe("A high-level summary of the profile's strengths and weaknesses."),
  scoreBreakdown: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories."),
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
  prompt: `You are a world-class LinkedIn profile reviewer and career coach, inspired by the detailed analysis of tools like Resume Worded. Your task is to provide a very precise and actionable review of a LinkedIn profile based on the provided data.

Profile Data: {{{profileData}}}

1.  **Set the Source Text**: Your entire analysis will be based on the 'Profile Data' provided. You MUST return the original, unedited 'Profile Data' in the 'extractedText' field of the output. This is the source material.

2.  **Analyze and Score with Precision**: Based on the text from the 'Profile Data', perform a detailed analysis and generate a score for each of the following categories. For each category, provide an overall score (0-100), high-level feedback, and a list of specific checks with a pass/fail status and detailed reasoning.

    **Categories to Analyze:**

    *   **Headline:**
        *   Checks:
            *   Length (is it between 8-20 words?).
            *   Keywords (does it contain relevant keywords for their target role/industry?).
            *   Value Proposition (does it clearly state their value?).
            *   Uniqueness (does it avoid generic titles like 'Unemployed' or 'Seeking opportunities'?).
    *   **Summary (About Section):**
        *   Checks:
            *   Presence (does a summary exist?).
            *   Length (is it between 3-5 short paragraphs, or around 100-200 words?).
            *   First-person perspective (is it written in the first person?).
            *   Call to Action (does it include a clear call to action at the end?).
            *   Keyword Optimization (is it optimized with relevant skills and keywords?).
    *   **Experience Section:**
        *   Checks:
            *   Action Verbs (are bullet points starting with strong action verbs?).
            *   Quantifiable Results (are there measurable achievements, e.g., 'Increased sales by 20%').
            *   Bullet Points (is the experience described using 3-5 bullet points per role?).
            *   Relevance (is the experience relevant to their likely career goals?).
    *   **Skills & Endorsements:**
        *   Checks:
            *   Number of Skills (are there at least 10-15 relevant skills listed?).
            *   Relevance of Skills (are the skills relevant to their industry/target roles?).
            *   Endorsements (do top skills have endorsements? Acknowledge you can't see endorsement counts, but check if the skills section is well-populated).
    *   **Profile Completeness:**
        *   Checks:
            *   Profile Picture (note the importance of a professional headshot).
            *   Banner Image (note the importance of a custom, relevant banner image).
            *   Education Section (is it filled out completely?).
            *   Custom URL (mention the importance of a custom vanity URL and check if the provided URL seems to be a custom one).

3.  **Calculate Overall Score**: Based on the individual category scores, calculate a weighted overall score from 0-100. The headline and experience sections are most important.

4.  **Provide High-Level Summary**: Write a brief, encouraging summary of the profile's key strengths and most important areas for improvement.

5.  **Format Output**: Return a single JSON object that strictly adheres to the provided output schema. Ensure all fields are populated correctly. The 'overallScore' should be the final calculated score. The 'scoreBreakdown' should be an array of objects, one for each category listed above.
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
