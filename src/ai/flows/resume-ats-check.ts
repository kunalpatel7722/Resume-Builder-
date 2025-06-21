
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
  prompt: `You are a world-class ATS (Applicant Tracking System) resume scanner and career coach, inspired by the extremely strict and detailed analysis of tools like Resume Worded. Your task is to provide a very precise, critical, and actionable review of a resume against a specific job description. You must be an exceptionally harsh but fair grader.

**CRITICAL SCORING GUIDELINES:**
- **Calibrate Harshly:** Do not be generous. An average, unoptimized resume should score between 20-40. A score above 85 is reserved for only the most exceptional, perfectly optimized resumes that meet every single criterion flawlessly.
- **No Partial Credit:** For a check to 'pass', it must be executed perfectly, not just attempted. If achievements are listed but are not quantified with strong metrics, the check fails.
- **Positive Reinforcement:** For passed checks, your 'details' should be encouraging and explain *why* it's a good practice. For overall feedback in each category and in the final summary, always start with the positives.

Resume Data (as PDF):
{{media url=resumePdfData}}

Job Description:
{{{jobDescription}}}

**Analysis Steps:**

1.  **Extract Resume Text**: Extract all text from the resume PDF. Return this in the 'extractedText' field. This is the source material for your entire analysis.

2.  **Keyword Analysis**:
    *   From the Job Description, identify the top 15-20 most critical hard skills, soft skills, and technologies (keywords).
    *   Thoroughly scan the extracted resume text for these keywords.
    *   Populate the 'keywordAnalysis' object with two distinct lists: 'foundKeywords' and 'missingKeywords'. This is the most critical step for ATS scoring.

3.  **Analyze and Score with Extreme Precision**: Perform a detailed analysis and generate a score for each category below. The scoring for each category and the overall score must be heavily influenced by the keyword match.

    **Categories to Analyze:**

    *   **Impact & Achievements:** (Weight: 30%)
        *   Checks:
            *   Quantified Results: Are there at least 3-5 bullet points across the entire resume with strong, specific, quantifiable metrics (e.g., "Increased user engagement by 25%," "Reduced server costs by $15,000 annually," "Managed a budget of $500k")?
            *   Strong Action Verbs: Does each bullet point start with a powerful and varied action verb (e.g., 'Architected,' 'Spearheaded,' 'Negotiated')? Avoid weak/passive phrases like 'Responsible for' or 'Duties included'.
            *   Achievement-Oriented Language: Do bullet points clearly describe accomplishments and their impact, rather than just listing job duties and responsibilities? (e.g., "Grew organic traffic by 150%" vs. "Did SEO").
    *   **Skills & Keywords Match:** (Weight: 35%)
        *   Checks:
            *   High Keyword Density: Based on your keyword analysis, is there a >80% match rate between the job description's critical keywords and those in the resume?
            *   Dedicated Skills Section: Is there a clearly labeled "Skills" or "Technical Skills" section that lists key competencies?
            *   Contextual Skill Integration: Are the most important keywords from the job description also naturally woven into the work experience bullet points?
            *   Skill Proficiency Levels: Does the resume avoid listing subjective proficiency levels like "Expert" or "Proficient" which are ignored by ATS?
    *   **Brevity & Formatting:** (Weight: 20%)
        *   Checks:
            *   ATS-Friendly Format: Is the resume completely free of columns, tables, images, icons, and text boxes? These elements can be misread by ATS.
            *   Standard Font & Size: Is a standard, professional font (e.g., Calibri, Georgia, Arial, Times New Roman) used at a readable size (10-12pt)?
            *   Appropriate Length: Is the resume 1 page for less than 10 years of experience, and a maximum of 2 pages for more?
            *   Concise Bullet Points: Are bullet points kept to 1-2 lines to maximize readability and impact?
    *   **Structure & Clarity:** (Weight: 15%)
        *   Checks:
            *   Standard Section Headers: Are common, ATS-friendly section headers used (e.g., "Work Experience", "Education", "Skills")? Avoid creative titles like "My Journey".
            *   Complete & Professional Contact Info: Are Name, Phone Number, Professional Email, and a clickable LinkedIn profile URL present at the top?
            *   Location Information: Is the City and State/Country included? A full street address is not necessary or recommended.
            *   Reverse-Chronological Order: Is all date-based information (Experience, Education) listed in reverse-chronological order (most recent first)?

4.  **Calculate Overall Score**: Calculate a weighted overall score from 0-100 based on the individual category scores and their specified weights. The final score should be calibrated downwards to fit the harsh scoring model.

5.  **Provide High-Level Summary**: Write a brief, encouraging summary of the resume's key strengths and the top 3 most critical areas for improvement. Always start with the strengths.

6.  **Generate Top 3 Improvement Tips**: Based on your deep analysis, identify the three most critical areas for improvement that will have the biggest impact on the score. Generate personalized, actionable tips for each. These must be concrete and directly reference the user's resume and the job description.

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
