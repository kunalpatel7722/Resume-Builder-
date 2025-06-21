'use server';

/**
 * @fileOverview A Genkit flow to generate professional resume summary suggestions.
 *
 * - generateResumeSummary - Generates summary options based on experience and skills.
 * - GenerateResumeSummaryInput - Input schema for the flow.
 * - GenerateResumeSummaryOutput - Output schema for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  description: z.string(),
});

const GenerateResumeSummaryInputSchema = z.object({
  experience: z.array(ExperienceSchema).describe("The user's work experience."),
  skills: z.array(z.string()).describe("A list of the user's skills."),
});
export type GenerateResumeSummaryInput = z.infer<typeof GenerateResumeSummaryInputSchema>;

const GenerateResumeSummaryOutputSchema = z.object({
  summaries: z.array(z.string()).describe("A list of 3-5 distinct, professional summary paragraphs."),
});
export type GenerateResumeSummaryOutput = z.infer<typeof GenerateResumeSummaryOutputSchema>;

export async function generateResumeSummary(input: GenerateResumeSummaryInput): Promise<GenerateResumeSummaryOutput> {
  return generateResumeSummaryFlow(input);
}

const generateResumeSummaryPrompt = ai.definePrompt({
  name: 'generateResumeSummaryPrompt',
  input: {schema: GenerateResumeSummaryInputSchema},
  output: {schema: GenerateResumeSummaryOutputSchema},
  prompt: `You are a professional resume writer and career coach. Your task is to generate 3 distinct, impactful professional summary options for a resume based on the user's provided experience and skills. Each summary should be a concise paragraph of 2-4 sentences.

Analyze the following information:

**Work Experience:**
{{#each experience}}
- **Role:** {{this.role}} at {{this.company}}
{{/each}}

**Key Skills:**
{{#if skills}}
{{skills}}
{{else}}
No skills provided.
{{/if}}

Instructions:
1.  Synthesize the key responsibilities and achievements from the work experience.
2.  Incorporate the most relevant skills into the summaries.
3.  Create 3 unique summaries that highlight the candidate's strengths and career trajectory.
4.  Ensure the tone is professional and confident.
5.  Return the output in the specified JSON format, with a 'summaries' array containing the generated paragraphs.
`,
});

const generateResumeSummaryFlow = ai.defineFlow(
  {
    name: 'generateResumeSummaryFlow',
    inputSchema: GenerateResumeSummaryInputSchema,
    outputSchema: GenerateResumeSummaryOutputSchema,
  },
  async (input) => {
    // Filter out any incomplete experience entries before sending to the AI
    const filteredInput = {
      ...input,
      experience: input.experience.filter(exp => exp.role && exp.company),
    };

    if (filteredInput.experience.length === 0 && filteredInput.skills.length === 0) {
        return { summaries: ["Please provide some work experience or skills to generate a summary."] };
    }

    const { output } = await generateResumeSummaryPrompt(filteredInput);
    if (!output) {
      throw new Error("The AI model failed to generate resume summaries.");
    }
    return output;
  }
);
