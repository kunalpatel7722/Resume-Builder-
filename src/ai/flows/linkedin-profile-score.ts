'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring a LinkedIn profile.
 *
 * - linkedinProfileScore -  A function that processes a LinkedIn profile PDF and returns a detailed score and analysis.
 * - LinkedinProfileScoreInput - The input type for the linkedinProfileScore function.
 * - LinkedinProfileScoreOutput - The return type for the linkedinProfileScoreOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LinkedinProfileScoreInputSchema = z.object({
  pdfProfileData: z.string().describe("The LinkedIn profile data as a PDF data URI."),
});

export type LinkedinProfileScoreInput = z.infer<typeof LinkedinProfileScoreInputSchema>;

const CheckSchema = z.object({
  title: z.string().describe("The title of the specific check performed."),
  status: z.enum(['pass', 'fail', 'warning']).describe("The status of the check: 'pass', 'fail', or 'warning'."),
  summary: z.string().describe("A one-sentence summary of the check's result."),
  details: z.string().describe("A detailed, actionable paragraph explaining how to improve, or what was done well. Provide concrete examples."),
});

const ScoreCategorySchema = z.object({
  title: z.string().describe("The title of the category, e.g., 'Headline' or 'Experience Section'."),
  score: z.number().describe("The score for this category (out of 100)."),
  summary: z.string().describe("Overall feedback for this category, summarizing what's good and what can be improved."),
  checks: z.array(CheckSchema).describe("A list of specific checks and their results for this category."),
});

const LinkedinProfileScoreOutputSchema = z.object({
  overallScore: z.number().describe("The overall score for the LinkedIn profile, from 0 to 100."),
  overallSummary: z.string().describe("A high-level summary of the profile's strengths and weaknesses, starting with the strengths."),
  reportSections: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories, structured as report sections."),
  extractedText: z.string().describe("The full text extracted from the provided LinkedIn profile data that was used for the analysis."),
  aiSuggestions: z.array(z.object({
    title: z.string().describe("A short, catchy title for the AI suggestion. e.g., 'Make Your Headline Stand Out'"),
    description: z.string().describe("A detailed, actionable paragraph explaining the AI-powered suggestion. It should explain *why* it's important and give a concrete example of how to apply it based on the user's profile."),
  })).describe("A list of the top 3 most impactful, personalized AI suggestions designed to directly improve the user's score. These should be concrete, actionable, and address the biggest weaknesses found in the analysis."),
});


export type LinkedinProfileScoreOutput = z.infer<typeof LinkedinProfileScoreOutputSchema>;

export async function linkedinProfileScore(input: LinkedinProfileScoreInput): Promise<LinkedinProfileScoreOutput> {
  return linkedinProfileScoreFlow(input);
}

const linkedinProfileScorePrompt = ai.definePrompt({
  name: 'linkedinProfileScorePrompt',
  input: {schema: LinkedinProfileScoreInputSchema},
  output: {schema: LinkedinProfileScoreOutputSchema},
  prompt: `You are a world-class LinkedIn profile reviewer and career coach. Your goal is to provide a detailed, actionable report to help users improve their professional brand.

**SCORING PHILOSOPHY:**
- **Encouraging but Critical:** Scores should be motivating. An average profile might score 50-65, a strong one 70-85. The goal is to show potential and a clear path to a 90+ score.
- **Clear Status:** For each check, assign a 'pass', 'fail', or 'warning' status. 'pass' for perfect execution, 'fail' for missing or poorly executed items, and 'warning' for items that are present but could be significantly improved.
- **Constructive Feedback:** For passed checks, your 'details' should explain *why* it's good. For failed checks, explain the problem and give clear, actionable advice with examples.

Profile Data:
{{media url=pdfProfileData}}

**Analysis Steps:**

1.  **Extract Profile Text**: Your entire analysis will be based on the 'Profile Data' provided. You MUST return the text used for analysis in the 'extractedText' field of the output.

2.  **Analyze and Score with Precision**: Based on the extracted text, perform a detailed analysis and generate a score for each of the following categories. Structure the entire output as 'reportSections'. For each category, provide a title, an overall score (0-100), a high-level summary, and a list of specific checks with a title, status (pass/fail/warning), a brief summary, and detailed, specific reasoning for the result.

    **Report Sections to Generate:**

    *   **Headline & Summary:**
        *   Checks:
            *   (Headline) Impactful Length: Is it between 10-20 words? (pass/fail)
            *   (Headline) Keyword Density: Does it contain 2-3 relevant keywords? (pass/fail)
            *   (Headline) Unique Value Proposition: Does it state value beyond a job title? (pass/fail)
            *   (Summary) Compelling Hook: Does the first sentence grab attention? (pass/fail)
            *   (Summary) Structured Narrative: Is it a well-structured story in 3-5 short paragraphs? (pass/fail)
            *   (Summary) Readability: Does it use white space and short paragraphs effectively? (pass/fail)
            *   (Summary) Call to Action: Does it end with a clear CTA? (pass/fail)
    *   **Experience Section:**
        *   Checks:
            *   Powerful Action Verbs: Does each bullet point start with a strong action verb? (pass/fail/warning)
            *   Quantifiable Achievements: Are there at least 2-3 measurable achievements for each recent role? (pass/fail/warning)
            *   Concise Bullet Points: Does it use 3-5 impactful bullet points per role? (pass/fail)
            *   Role Context: Is there a brief, 1-2 sentence description of the company/role? (pass/fail)
    *   **Skills & Social Proof:**
        *   Checks:
            *   Sufficient Skill Quantity: Are there at least 20-30 relevant skills? (pass/fail/warning)
            *   Skill Relevance: Are the skills tailored to their target industry? (pass/fail)
            *   Recommendations: Note the importance of having 2-3 recommendations for social proof. (This is a 'warning' if they are missing, as it's advice).
    *   **Profile Completeness:**
        *   Checks:
            *   Professional Headshot: Advise on the importance of a professional photo. (warning)
            *   Custom Banner Image: Advise on using a custom banner. (warning)
            *   Filled-out Education: Is the education section complete? (pass/fail)
            *   Custom URL: Advise on creating a vanity URL. (warning)
            *   Featured Section: Advise on using the 'Featured' section. (warning)

3.  **Calculate Overall Score**: Based on the individual category scores, calculate a weighted overall score from 0-100.

4.  **Provide High-Level Summary**: Write a brief 'overallSummary' of the profile's key strengths and the top 3 most critical areas for improvement. Start with the strengths.

5.  **Generate Top 3 AI Suggestions**: Based on your analysis, identify the three areas where an improvement would have the **most significant positive impact on the overall score**. For each, generate a personalized, actionable suggestion. These tips must be highly specific to the user's profile content, explain *why* the change is important for their score, and give a concrete example of how to apply it. Return these in the 'aiSuggestions' field.

6.  **Format Output**: Return a single JSON object that strictly adheres to the provided output schema. Ensure all fields are populated correctly.
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
        if (!input.pdfProfileData) {
          throw new Error('No profile data provided. Please upload a PDF.');
        }

        const { output } = await linkedinProfileScorePrompt(input);
        if (!output) {
          throw new Error('AI model returned an empty response.');
        }
        return output;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for linkedinProfileScoreFlow:`, error);
        if (i === maxRetries - 1) {
          throw new Error('Could not analyze the profile after multiple attempts. The PDF might be corrupted or the AI may be temporarily unavailable.');
        }
        const delay = Math.pow(2, i) * 1000; // 1s, 2s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    // This part is unreachable if the loop always returns or throws.
    // Throwing an error here to satisfy TypeScript's requirement for a return value on all paths.
    throw new Error('An unexpected error occurred in the analysis flow.');
  }
);
