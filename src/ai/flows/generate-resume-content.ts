'use server';

/**
 * @fileOverview A Genkit flow to generate resume content suggestions based on a job title.
 *
 * - generateResumeContent - Generates professional-sounding responsibilities and skills.
 * - GenerateResumeContentInput - Input schema for the flow.
 * - GenerateResumeContentOutput - Output schema for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateResumeContentInputSchema = z.object({
  jobTitle: z.string().describe("The job title to generate content for, e.g., 'Software Engineer' or 'Marketing Manager'."),
});
export type GenerateResumeContentInput = z.infer<typeof GenerateResumeContentInputSchema>;

export const GenerateResumeContentOutputSchema = z.object({
  responsibilities: z.array(z.string()).describe("A list of 5-7 concise, action-oriented bullet points describing typical responsibilities for the job title."),
  skills: z.array(z.string()).describe("A list of 8-10 relevant hard and soft skills for the job title."),
});
export type GenerateResumeContentOutput = z.infer<typeof GenerateResumeContentOutputSchema>;

export async function generateResumeContent(input: GenerateResumeContentInput): Promise<GenerateResumeContentOutput> {
  return generateResumeContentFlow(input);
}

const generateResumeContentPrompt = ai.definePrompt({
  name: 'generateResumeContentPrompt',
  input: {schema: GenerateResumeContentInputSchema},
  output: {schema: GenerateResumeContentOutputSchema},
  prompt: `You are a professional resume writer and career coach.
Given a job title, your task is to generate a list of impactful responsibilities and relevant skills.

Job Title: {{{jobTitle}}}

Instructions:
1.  **Responsibilities**: Create a list of 5 to 7 bullet points. Each bullet point should start with a strong action verb and describe a key responsibility or achievement for this role. Focus on quantifiable results where possible (e.g., "Managed a budget of $X", "Increased sales by Y%"). The tone should be professional and confident.
2.  **Skills**: Create a list of 8 to 10 relevant skills. Include a mix of technical (hard) skills and interpersonal (soft) skills that are crucial for success in the specified role.

Return the output in the specified JSON format.
`,
});

const generateResumeContentFlow = ai.defineFlow(
  {
    name: 'generateResumeContentFlow',
    inputSchema: GenerateResumeContentInputSchema,
    outputSchema: GenerateResumeContentOutputSchema,
  },
  async (input) => {
    const { output } = await generateResumeContentPrompt(input);
    if (!output) {
      throw new Error("The AI model failed to generate resume content.");
    }
    return output;
  }
);
