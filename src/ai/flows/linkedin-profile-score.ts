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

const ScoreCategorySchema = z.object({
  title: z.string().describe("The title of the category, e.g., 'Headline' or 'Experience Section'."),
  score: z.number().describe("The score for this category (out of 100)."),
  feedback: z.string().describe("Overall feedback for this category, summarizing what's good and what can be improved. Always start by highlighting the positive aspects before suggesting improvements."),
  checks: z.array(z.object({
    check: z.string().describe("A specific check performed within this category, e.g., 'Is your headline between 10-20 words long?'"),
    passed: z.boolean().describe("Whether the profile passed this specific check."),
    details: z.string().describe("A short, encouraging explanation of why this check passed, or a constructive explanation of why it failed and how to improve it."),
  })).describe("A list of specific checks and their results for this category."),
});

const ImprovementTipSchema = z.object({
  title: z.string().describe("A short, catchy title for the improvement tip. e.g., 'Make Your Headline Stand Out'"),
  description: z.string().describe("A detailed, actionable paragraph explaining the improvement. It should explain *why* it's important and give a concrete example of how to apply it based on the user's profile."),
});

const LinkedinProfileScoreOutputSchema = z.object({
  overallScore: z.number().describe("The overall score for the LinkedIn profile, from 0 to 100."),
  summaryFeedback: z.string().describe("A high-level summary of the profile's strengths and weaknesses, starting with the strengths."),
  scoreBreakdown: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories."),
  improvementTips: z.array(ImprovementTipSchema).describe("A list of the top 3 most impactful, personalized improvement tips based on the analysis. These should be concrete and actionable, directly addressing the biggest weaknesses found in the profile."),
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
  prompt: `You are a world-class LinkedIn profile reviewer and career coach, inspired by the detailed, encouraging, and actionable analysis of tools like Enhancv. Your goal is to empower users to improve.

**SCORING PHILOSOPHY:**
- **Encouraging but Firm:** Your scoring should be motivating but realistic. A good profile that needs some work should score between 60-75. A score above 90 is reserved for truly exceptional, well-optimized profiles. The score provides a baseline, but your primary value is in the detailed, actionable feedback that helps the user get to 100.
- **No Partial Credit:** For a check to 'pass', it must be executed perfectly, not just attempted. If achievements are listed but are not quantified with strong metrics, the check fails.
- **Constructive Feedback:** For passed checks, your 'details' should be encouraging and explain *why* it's a good practice. For overall feedback in each category and in the final summary, always start with the positives before moving to critiques.

Profile Data:
{{media url=pdfProfileData}}

**Analysis Steps:**

1.  **Set the Source Text**: Your entire analysis will be based on the 'Profile Data' provided. You MUST return the text used for analysis in the 'extractedText' field of the output. If the input was a PDF, this should be the text extracted from the PDF. This is the source material.

2.  **Analyze and Score with Precision**: Based on the text from the 'Profile Data', perform a detailed analysis and generate a score for each of the following categories. For each category, provide an overall score (0-100), high-level feedback, and a list of specific checks with a pass/fail status and detailed, specific reasoning for the result. Be critical in your analysis but balanced and constructive in your feedback.

    **Categories to Analyze:**

    *   **Headline:**
        *   Checks:
            *   Impactful Length (is it between 10-20 words? This is the optimal range for impact and readability).
            *   Keyword Density (does it contain 2-3 highly relevant keywords for their target role/industry? e.g., 'Software Engineer | AI/ML | Backend Systems').
            *   Unique Value Proposition (does it clearly and uniquely state their value beyond just a job title? e.g., 'Helping SaaS companies scale through data-driven growth marketing').
            *   Avoids Clichés (does it avoid generic titles like 'Seeking new opportunities' or overly used buzzwords without context?).
    *   **Summary (About Section):**
        *   Checks:
            *   Compelling Hook (does the first sentence grab the reader's attention and make them want to read more?).
            *   Structured Narrative (is it well-structured in 3-5 short paragraphs, telling a career story, not just listing skills? It should cover who they are, their key achievements, and their career goals).
            *   Readability (does it use white space effectively? Are paragraphs short and easy to scan?).
            *   Clear Call to Action (does it end with a clear, professional call to action, e.g., 'Feel free to connect or reach out at...').
            *   Strategic Keywords (is it optimized with a good mix of relevant skills, industry terms, and keywords?).
    *   **Experience Section:**
        *   Checks:
            *   Powerful Action Verbs (does each bullet point start with a strong, varied action verb like 'Orchestrated', 'Architected', 'Accelerated' instead of just 'Managed' or 'Led'?).
            *   Quantifiable Achievements (are there at least 2-3 measurable achievements with metrics like %, $, or # for each recent role? This is critical. Simply listing responsibilities is not enough).
            *   Concise Bullet Points (is the experience described using 3-5 concise, impactful bullet points per role?).
            *   Role Context (is there a brief, 1-2 sentence description of the company and the role's primary responsibility before the bullet points?).
    *   **Skills & Endorsements:**
        *   Checks:
            *   Sufficient Skill Quantity (are there at least 20-30 relevant skills listed? A comprehensive list is crucial).
            *   Skill Relevance (are the skills directly relevant and tailored to their target industry and roles mentioned in the headline/summary?).
            *   Top Skills Pinned (note the importance of pinning the 3 most critical skills to the top of the section, as this is prime real estate).
    *   **Profile Completeness & Social Proof:**
        *   Checks:
            *   Professional Headshot (note the importance of a clear, professional headshot - no selfies, no group photos).
            *   Custom Banner Image (note the importance of a custom banner that reflects their professional brand, not the default LinkedIn one).
            *   Filled-out Education Section (is the education section complete with degrees, institutions, and dates?).
            *   Custom URL (mention the importance of a custom vanity URL for branding, e.g., /in/john-doe).
            *   Featured Section (note the importance of using the 'Featured' section to showcase top work, articles, or projects. An empty featured section is a missed opportunity).
            *   Recommendations (note the importance of having at least 2-3 recommendations from previous managers or colleagues for social proof. These are essential for building trust).

3.  **Calculate Overall Score**: Based on the individual category scores, calculate a weighted overall score from 0-100. The overall score should be a weighted average reflecting the importance of each section.

4.  **Provide High-Level Summary**: Write a brief summary of the profile's key strengths and the top 3 most critical areas for improvement. **Start with the strengths first.**

5.  **Generate Top 3 Improvement Tips**: Based on your analysis, identify the three most critical areas for improvement. For each, generate a personalized, actionable tip. These tips should be highly specific to the user's profile content and address the most significant gaps you've found. They must not be generic advice. Return these in the 'improvementTips' field.

6.  **Format Output**: Return a single JSON object that strictly adheres to the provided output schema. Ensure all fields are populated correctly. The 'overallScore' should be the final calculated score. The 'scoreBreakdown' should be an array of objects, one for each category listed above.
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
