
'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring a resume, either against a specific job description or for general quality.
 *
 * - resumeAtsCheck - A function that processes a resume PDF and an optional job description and returns a detailed score and analysis.
 * - ResumeAtsCheckInput - The input type for the resumeAtsCheck function.
 * - ResumeAtsCheckOutput - The return type for the resumeAtsCheckOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeAtsCheckInputSchema = z.object({
  resumePdfData: z.string().describe("The resume data as a PDF data URI."),
  jobDescription: z.string().optional().describe("The full text of the job description the user is applying for. If not provided, a general resume review will be performed."),
});

export type ResumeAtsCheckInput = z.infer<typeof ResumeAtsCheckInputSchema>;

const ScoreCategorySchema = z.object({
  title: z.string().describe("The title of the category, e.g., 'Keyword Match' or 'Work Experience'."),
  score: z.number().describe("The score for this category (out of 100)."),
  feedback: z.string().describe("Overall feedback for this category, summarizing what's good and what can be improved."),
  checks: z.array(z.object({
    check: z.string().describe("A specific check performed within this category."),
    passed: z.boolean().describe("Whether the resume passed this specific check."),
    details: z.string().describe("A short, encouraging explanation of why this check passed, or a constructive explanation of why it failed and how to improve it."),
  })).describe("A list of specific checks and their results for this category."),
});

const ImprovementTipSchema = z.object({
  title: z.string().describe("A short, catchy title for the improvement tip."),
  description: z.string().describe("A detailed, actionable paragraph explaining the improvement with examples."),
});

const ResumeAtsCheckOutputSchema = z.object({
  overallScore: z.number().describe("The overall score for the resume, from 0 to 100."),
  summaryFeedback: z.string().describe("A high-level summary of the resume's strengths and weaknesses, starting with the strengths."),
  scoreBreakdown: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories relevant to the analysis."),
  improvementTips: z.array(ImprovementTipSchema).describe("A list of the top 3 most impactful, personalized improvement tips."),
  extractedText: z.string().describe("The full text extracted from the provided resume PDF that was used for the analysis."),
  keywordAnalysis: z.object({
      foundKeywords: z.array(z.string()).describe("List of important keywords from the job description that were found in the resume."),
      missingKeywords: z.array(z.string()).describe("List of important keywords from the job description that were NOT found in the resume."),
  }).optional().describe("Analysis of keywords from the job description compared to the resume. This will only be present if a job description was provided."),
});


export type ResumeAtsCheckOutput = z.infer<typeof ResumeAtsCheckOutputSchema>;

export async function resumeAtsCheck(input: ResumeAtsCheckInput): Promise<ResumeAtsCheckOutput> {
  return resumeAtsCheckFlow(input);
}

const resumeAtsCheckPrompt = ai.definePrompt({
  name: 'resumeAtsCheckPrompt',
  input: {schema: ResumeAtsCheckInputSchema},
  output: {schema: ResumeAtsCheckOutputSchema},
  prompt: `You are a world-class resume checker AI, inspired by the detailed, section-by-section analysis of tools like Enhancv. Your task is to provide a comprehensive, strict, and actionable review of a resume.

**CRITICAL SCORING GUIDELINES:**
- **Calibrate Harshly:** Be a tough grader. An average, unoptimized resume should score between 30-50. A score above 85 is reserved for truly exceptional resumes that meet every criterion flawlessly.
- **No Partial Credit:** A check must be executed perfectly to 'pass'. For example, if a resume has *some* metrics but not enough, the check fails.
- **Constructive Feedback:** For passed checks, your 'details' should explain *why* it's good. For failed checks, explain the problem and give clear, actionable advice. Always start overall feedback with positives.

Resume Data (as PDF):
{{media url=resumePdfData}}

{{#if jobDescription}}
Job Description:
{{{jobDescription}}}
{{/if}}

**Analysis Steps:**

1.  **Extract Resume Text**: Extract all text from the resume PDF. This is your source material. Return this full text in the 'extractedText' field.

{{#if jobDescription}}
2.  **Keyword Analysis**:
    *   Identify the top 15-20 most critical hard and soft skills (keywords) from the Job Description.
    *   Scan the resume for these keywords.
    *   Populate the 'keywordAnalysis' object with 'foundKeywords' and 'missingKeywords'. If no job description is provided, this field MUST be omitted from the output.

3.  **Analyze and Score (ATS-Focused)**: Perform a detailed analysis and generate a score for each category below, focusing on how well the resume is optimized for an Applicant Tracking System (ATS) based on the provided job description. The scoring must be heavily influenced by the keyword match.

    **Categories to Analyze (ATS Scan):**
    *   **Resume Sections (Weight: 25%)**: Evaluates the presence and completeness of essential resume sections. Checks: Contact Info, Summary/Objective, Work Experience, Education, Skills.
    *   **Content Analysis (Weight: 35%)**: Analyzes the quality and impact of the language. Checks: Action Verbs, Quantifiable Metrics, Conciseness, Keyword Integration, Filler & Buzzwords.
    *   **Formatting & Readability (Weight: 25%)**: Assesses the visual presentation. Checks: Resume Length, Font & Size, Date Formatting, Consistent Layout, Use of White Space.
    *   **ATS Compatibility (Weight: 15%)**: Checks for technical elements that affect machine readability. Checks: ATS-Friendly Design, Standard Headers, File Format quality, Contact Info Parsing.

{{else}}
2.  **Analyze and Score (General Review)**: Perform a detailed analysis and generate a score for each category below, focusing on general resume best practices for clarity, impact, and professionalism.

    **Categories to Analyze (General Review):**
    *   **Resume Sections (Weight: 25%)**: Evaluates the presence and completeness of essential resume sections. Checks: Professional Contact Info, Compelling Summary/Objective, Defined Work Experience, Education Section, Dedicated Skills Section.
    *   **Content & Impact (Weight: 40%)**: Analyzes the quality and impact of the language. Checks: Use of Strong Action Verbs, Quantifiable Achievements (at least 3-5 across the resume), Concise Bullet Points (1-2 lines), Professional Tone (free of clichés and filler).
    *   **Formatting & Readability (Weight: 35%)**: Assesses the visual presentation and consistency. Checks: Appropriate Length (1 page for <10 years exp.), Professional Font & Size (10-12pt), Consistent Date Formatting, Clean Layout with White Space, No typos or grammatical errors.
    
    **IMPORTANT**: Since no job description was provided, you MUST NOT generate the 'keywordAnalysis' field in the output. Your analysis should be general and not tailored to a specific role.

{{/if}}

4.  **Calculate Overall Score**: Calculate a weighted overall score from 0-100 based on the individual category scores and their specified weights for the relevant analysis type (ATS or General). Calibrate the final score downwards to fit the harsh scoring model.

5.  **Provide High-Level Summary**: Write a brief, encouraging summary of the resume's key strengths and the top 3 most critical areas for improvement. Start with the strengths.

6.  **Generate Top 3 Improvement Tips**: Based on your analysis, identify the three most critical areas for improvement that will have the biggest impact on the score. Generate personalized, actionable tips.

7.  **Format Output**: Return a single JSON object that strictly adheres to the output schema. Ensure all fields are populated correctly.
`,
});

const resumeAtsCheckFlow = ai.defineFlow(
  {
    name: 'resumeAtsCheckFlow',
    inputSchema: ResumeAtsCheckInputSchema,
    outputSchema: ResumeAtsCheckOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        if (!input.resumePdfData) {
          throw new Error('No resume provided.');
        }

        const { output } = await resumeAtsCheckPrompt(input);
        if (!output) {
          throw new Error('AI model returned an empty response.');
        }
        return output;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for resumeAtsCheckFlow:`, error);
        if (i === maxRetries - 1) {
          throw new Error('Could not analyze the resume after multiple attempts. The PDF might be corrupted or the AI may be temporarily unavailable.');
        }
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('An unexpected error occurred in the analysis flow.');
  }
);
