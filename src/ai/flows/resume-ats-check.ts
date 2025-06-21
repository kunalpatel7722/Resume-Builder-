
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

const AiSuggestionSchema = z.object({
  title: z.string().describe("A short, catchy title for the AI suggestion."),
  description: z.string().describe("A detailed, actionable paragraph explaining the AI-powered suggestion with examples."),
});

const ResumeAtsCheckOutputSchema = z.object({
  overallScore: z.number().describe("The overall score for the resume, from 0 to 100."),
  summaryFeedback: z.string().describe("A high-level summary of the resume's strengths and weaknesses, starting with the strengths."),
  scoreBreakdown: z.array(ScoreCategorySchema).describe("A detailed breakdown of the score across multiple categories relevant to the analysis."),
  aiSuggestions: z.array(AiSuggestionSchema).describe("A list of the top 3 most impactful, personalized AI suggestions designed to directly improve the user's score. These should be concrete, actionable, and address the biggest weaknesses found in the analysis."),
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
  prompt: `You are a world-class resume checker AI, inspired by the detailed, section-by-section analysis of tools like Enhancv. Your goal is to provide encouraging, yet critical and actionable feedback to help users land their dream job.

**SCORING PHILOSOPHY:**
- **Encouraging yet Critical:** Scores should be motivating. An average resume might score 50-65, a strong one 70-85. The goal is to show potential and a clear path to a 90+ score.
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
    *   **Content (Weight: 35%)**: Analyzes the quality of language and achievements.
        *   Checks:
            *   Quantifying Impact: Are there at least 3-5 measurable achievements with metrics (%, $, #) across the resume?
            *   Active Voice: Does each bullet point start with a strong, varied action verb (e.g., 'Orchestrated', 'Accelerated')?
            *   Buzzwords & Cliches: Does the resume avoid vague buzzwords ('team player', 'hard worker') and focus on concrete skills?
            *   Repetition: Does it avoid repeating the same action verbs and phrases excessively?
    *   **Tailoring (Weight: 25%)**: Assesses how well the resume is tailored to the job description.
        *   Checks:
            *   Hard Skills Match: Does the resume contain a high percentage of the hard skills identified in the job description?
            *   Soft Skills Match: Does the resume reflect the soft skills (e.g., 'communication', 'leadership') mentioned in the job description?
            *   Keyword Density: Are keywords from the job description naturally integrated throughout the experience section, not just listed in a skills section?
    *   **Format & Sections (Weight: 25%)**: Evaluates the visual presentation, structure, and clarity.
        *   Checks:
            *   Resume Length: Is the resume an appropriate length (ideally 1 page for <10 years experience, max 2 pages for more)?
            *   Spelling & Grammar: Is the resume free of typos and grammatical errors? A single error should fail this check.
            *   Essential Sections: Does the resume include all essential sections: Contact Info, Work Experience, Education, and Skills?
            *   Contact Information: Is the contact information complete (Name, Phone, Email, LinkedIn URL) and professional?
            *   Readability: Is the layout clean, with consistent formatting, readable font (10-12pt), and good use of white space? Avoids long paragraphs.
    *   **ATS Compatibility (Weight: 15%)**: Checks technical elements for parsability.
        *   Checks:
            *   ATS Parse Rate: Is the design simple, avoiding columns, images, graphics, or complex tables that can confuse an ATS?
            *   Standard Headers: Does it use standard, recognizable section headers (e.g., "Work Experience", "Education")?
            *   File Format: Note the importance of using PDF format for universal compatibility.

{{else}}
2.  **Analyze and Score (General Review)**: Perform a detailed analysis and generate a score for each category below, focusing on general resume best practices.

    **Categories to Analyze (General Review):**
    *   **Content (Weight: 40%)**: Analyzes the quality of language and achievements.
        *   Checks:
            *   Quantifying Impact: Are there at least 3-5 measurable achievements with metrics (%, $, #) across the resume?
            *   Active Voice: Does each bullet point start with a strong, varied action verb?
            *   Buzzwords & Cliches: Does the resume avoid vague buzzwords and focus on concrete skills?
            *   Spelling & Grammar: Is the resume free of typos and grammatical errors?
    *   **Format & Sections (Weight: 40%)**: Evaluates the visual presentation, structure, and clarity.
        *   Checks:
            *   Resume Length: Is the resume an appropriate length (ideally 1 page)?
            *   Essential Sections: Does the resume include all essential sections: Contact Info, Work Experience, Education, and Skills?
            *   Contact Information: Is the contact information complete and professional (professional email address)?
            *   Readability: Is the layout clean, with consistent formatting, readable font (10-12pt), and good use of white space?
    *   **ATS Compatibility (Weight: 20%)**: Checks technical elements for parsability.
        *   Checks:
            *   ATS Parse Rate: Is the design simple, avoiding columns, images, or complex tables?
            *   Standard Headers: Does it use standard, recognizable section headers?
            *   File Format: Note the importance of using PDF format.
    
    **IMPORTANT**: Since no job description was provided, you MUST NOT generate the 'keywordAnalysis' field in the output. Your analysis should be general and not tailored to a specific role.

{{/if}}

4.  **Calculate Overall Score**: Calculate a weighted overall score from 0-100 based on the individual category scores and their specified weights for the relevant analysis type (ATS or General).

5.  **Provide High-Level Summary**: Write a brief, encouraging summary of the resume's key strengths and the top 3 most critical areas for improvement. Start with the strengths.

6.  **Generate Top 3 AI Suggestions**: Based on your analysis, identify the three areas where an improvement would have the **most significant positive impact on the overall score**. For each, generate a personalized, actionable AI suggestion. These tips must be highly specific to the user's resume, explain *why* the change is important for their score, and give a concrete example of how to apply it (referencing the job description if available). Return these in the 'aiSuggestions' field.

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
