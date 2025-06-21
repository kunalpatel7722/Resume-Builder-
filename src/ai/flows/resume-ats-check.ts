'use server';

/**
 * @fileOverview This file defines a Genkit flow for scoring a resume against a job description.
 *
 * - resumeAtsCheck - A function that processes a resume PDF and a job description and returns a detailed score and analysis.
 * - ResumeAtsCheckInput - The input type for the resumeAtsCheck function.
 * - ResumeAtsCheckOutput - The return type for the resumeAtsCheckOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeAtsCheckInputSchema = z.object({
  resumePdfData: z.string().describe("The resume data as a PDF data URI."),
  jobDescription: z.string().describe("The full text of the job description the user is applying for."),
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
  overallScore: z.number().describe("The overall ATS score for the resume against the job description, from 0 to 100."),
  summaryFeedback: z.string().describe("A high-level summary of the resume's strengths and weaknesses, starting with the strengths."),
  scoreBreakdown: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories relevant to ATS scanning."),
  improvementTips: z.array(ImprovementTipSchema).describe("A list of the top 3 most impactful, personalized improvement tips."),
  extractedText: z.string().describe("The full text extracted from the provided resume PDF that was used for the analysis."),
  keywordAnalysis: z.object({
      foundKeywords: z.array(z.string()).describe("List of important keywords from the job description that were found in the resume."),
      missingKeywords: z.array(z.string()).describe("List of important keywords from the job description that were NOT found in the resume."),
  }).describe("Analysis of keywords from the job description compared to the resume."),
});


export type ResumeAtsCheckOutput = z.infer<typeof ResumeAtsCheckOutputSchema>;

export async function resumeAtsCheck(input: ResumeAtsCheckInput): Promise<ResumeAtsCheckOutput> {
  return resumeAtsCheckFlow(input);
}

const resumeAtsCheckPrompt = ai.definePrompt({
  name: 'resumeAtsCheckPrompt',
  input: {schema: ResumeAtsCheckInputSchema},
  output: {schema: ResumeAtsCheckOutputSchema},
  prompt: `You are a world-class ATS (Applicant Tracking System) resume scanner and career coach. Your task is to provide a very precise, critical, and actionable review of a resume against a specific job description. You must be an exceptionally harsh but fair grader.

**CRITICAL SCORING GUIDELINES:**
- **Calibrate Harshly:** An unoptimized resume should score between 20-40. A score above 85 is for perfectly optimized resumes only.
- **No Partial Credit:** A check must be executed perfectly to pass.
- **Positive Reinforcement:** Always start feedback with positives.

Resume Data (as PDF):
{{media url=resumePdfData}}

Job Description:
{{{jobDescription}}}

**Analysis Steps:**

1.  **Extract Resume Text**: Extract all text from the resume PDF. Return this in the 'extractedText' field. This is the source material.

2.  **Keyword Analysis**:
    *   Identify the top 10-15 most important hard skills and soft skills (keywords) from the job description.
    *   Compare this list against the extracted resume text.
    *   Populate the 'keywordAnalysis' object with the lists of found and missing keywords. This is a critical step for ATS scoring.

3.  **Analyze and Score with Extreme Precision**: Perform a detailed analysis and generate a score for each category below.

    **Categories to Analyze:**

    *   **Keyword & Skills Match:**
        *   Checks:
            *   High Keyword Relevance (is there a >75% match between job description keywords and resume keywords?).
            *   Skills Section Presence (is there a dedicated 'Skills' section with relevant technical and soft skills?).
            *   Contextual Keywords (are keywords used naturally within work experience descriptions, not just listed?).
    *   **Work Experience:**
        *   Checks:
            *   Quantifiable Achievements (are there at least 2 measurable achievements with metrics like %, $, or # for each recent role?).
            *   Powerful Action Verbs (does each bullet point start with a strong action verb like 'Orchestrated', 'Accelerated' instead of 'Responsible for'?).
            *   Relevance to Job Description (is the experience described clearly tailored to the target job's requirements?).
            *   Clear Structure (are roles listed in reverse chronological order with clear titles, company names, and dates?).
    *   **Formatting & ATS Compatibility:**
        *   Checks:
            *   ATS-Friendly Format (is the resume free of columns, tables, images, and headers/footers that can confuse an ATS?).
            *   Standard Font (is a standard, readable font like Calibri, Arial, or Times New Roman used?).
            *   Appropriate Length (is the resume 1 page for <10 years of experience, and max 2 pages for more?).
            *   File Type (mention the importance of submitting as a PDF).
    *   **Contact Information & Header:**
        *   Checks:
            *   Complete Contact Info (are name, phone number, email, and a LinkedIn URL present and professional?).
            *   Professional Email (is the email address professional, e.g., firstname.lastname@email.com?).
            *   Clean Header (is the header section clean and easy to read, without unnecessary graphics?).

4.  **Calculate Overall Score**: Calculate a weighted overall score. The Keyword Match is the most important category. Calibrate the final score downwards.

5.  **Provide High-Level Summary**: Write a brief summary of the resume's key strengths and the top 3 areas for improvement. Start with strengths.

6.  **Generate Top 3 Improvement Tips**: Based on your analysis, identify the three most critical areas for improvement and generate personalized, actionable tips.

7.  **Format Output**: Return a single JSON object that strictly adheres to the output schema.
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
        if (!input.resumePdfData || !input.jobDescription) {
          throw new Error('No resume or job description provided.');
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
