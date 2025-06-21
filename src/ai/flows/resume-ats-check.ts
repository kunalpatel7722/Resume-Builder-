
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
  prompt: `You are a world-class resume checker AI, inspired by the detailed, section-by-section analysis of tools like Enhancv. Your goal is to provide a comprehensive, strict, and actionable review of a resume against a job description, focusing on content, formatting, and ATS compatibility.

**CRITICAL SCORING GUIDELINES:**
- **Calibrate Harshly:** Be a tough grader. An average, unoptimized resume should score between 30-50. A score above 85 is reserved for truly exceptional resumes that meet every criterion flawlessly.
- **No Partial Credit:** A check must be executed perfectly to 'pass'. For example, if a resume has *some* metrics but not enough, the check fails.
- **Constructive Feedback:** For passed checks, your 'details' should explain *why* it's good. For failed checks, explain the problem and give clear, actionable advice. Always start overall feedback with positives.

Resume Data (as PDF):
{{media url=resumePdfData}}

Job Description:
{{{jobDescription}}}

**Analysis Steps:**

1.  **Extract Resume Text**: Extract all text from the resume PDF. This is your source material. Return this full text in the 'extractedText' field.

2.  **Keyword Analysis**:
    *   Identify the top 15-20 most critical hard and soft skills (keywords) from the Job Description.
    *   Scan the resume for these keywords.
    *   Populate the 'keywordAnalysis' object with 'foundKeywords' and 'missingKeywords'.

3.  **Analyze and Score with Precision**: Perform a detailed analysis and generate a score for each category below. The scoring must be heavily influenced by the keyword match and the specific checks.

    **Categories to Analyze:**

    *   **Resume Sections (Weight: 25%)**: Evaluates the presence and completeness of essential resume sections.
        *   Checks:
            *   Contact Information: Is professional contact info (Name, Phone, Email, LinkedIn URL) present and easily accessible at the top?
            *   Summary/Objective: Is a concise, compelling professional summary or objective statement included to frame the resume?
            *   Work Experience: Is a clearly defined "Work Experience" or similar section present with job titles, companies, and dates?
            *   Education: Is the "Education" section present with institution, degree, and graduation date?
            *   Skills: Is there a dedicated "Skills" section listing technical and soft skills?

    *   **Content Analysis (Weight: 35%)**: Analyzes the quality and impact of the language used.
        *   Checks:
            *   Action Verbs: Does each bullet point begin with a strong, varied action verb (e.g., 'Spearheaded,' 'Engineered,' 'Maximized')? Avoids passive language like 'Responsible for'.
            *   Quantifiable Metrics: Are there at least 3-5 powerful, quantifiable achievements (using numbers, %, or $) across the resume?
            *   Conciseness: Are bullet points concise (ideally 1-2 lines) and easy to scan? Avoids long, dense paragraphs.
            *   Keyword Integration: Are the most important keywords from the job description naturally integrated into the experience bullet points, not just listed in the skills section?
            *   Filler & Buzzwords: Is the language professional and free from clichés ("team player") or filler phrases ("duties included")?

    *   **Formatting & Readability (Weight: 25%)**: Assesses the visual presentation and consistency.
        *   Checks:
            *   Resume Length: Is the resume 1 page for <10 years of experience, and max 2 pages for more? Brevity is key.
            *   Font & Size: Is a standard, professional font (e.g., Calibri, Georgia) used at a readable size (10-12pt)?
            *   Date Formatting: Is the date format consistent across all sections (e.g., "Jan 2022 - Present" or "01/2022 - Present")?
            *   Consistent Layout: Is the overall layout clean, with consistent use of bolding, italics, and spacing to guide the reader's eye?
            *   Use of White Space: Is there sufficient white space (margins, line spacing) to avoid a cluttered look and improve readability?

    *   **ATS Compatibility (Weight: 15%)**: Checks for technical elements that affect machine readability.
        *   Checks:
            *   ATS-Friendly Design: Is the resume free of elements that can confuse an ATS, such as tables, columns, images, and text boxes?
            *   Standard Headers: Are standard section headers used (e.g., "Work Experience") that an ATS can easily parse?
            *   File Format: Note the importance of submitting as a PDF to preserve formatting, and confirm the text extraction quality is high.
            *   Contact Info Parsing: Is contact information presented simply, without icons, so it can be parsed correctly?

4.  **Calculate Overall Score**: Calculate a weighted overall score from 0-100 based on the individual category scores and their specified weights. Calibrate the final score downwards to fit the harsh scoring model.

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
