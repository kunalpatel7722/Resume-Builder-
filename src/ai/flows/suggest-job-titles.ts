'use server';

/**
 * @fileOverview A Genkit flow to suggest job titles based on user input.
 *
 * - suggestJobTitles - Suggests job titles based on a query.
 * - SuggestJobTitlesInput - Input schema for the flow.
 * - SuggestJobTitlesOutput - Output schema for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestJobTitlesInputSchema = z.object({
  query: z.string().describe("The partial job title typed by the user."),
});
export type SuggestJobTitlesInput = z.infer<typeof SuggestJobTitlesInputSchema>;

const SuggestJobTitlesOutputSchema = z.object({
  titles: z.array(z.string()).describe("A list of up to 5 full job title suggestions."),
});
export type SuggestJobTitlesOutput = z.infer<typeof SuggestJobTitlesOutputSchema>;

export async function suggestJobTitles(input: SuggestJobTitlesInput): Promise<SuggestJobTitlesOutput> {
  return suggestJobTitlesFlow(input);
}

const suggestJobTitlesPrompt = ai.definePrompt({
  name: 'suggestJobTitlesPrompt',
  input: {schema: SuggestJobTitlesInputSchema},
  output: {schema: SuggestJobTitlesOutputSchema},
  prompt: `You are a helpful career assistant. A user is typing a job title.
Given their partial input, provide a list of up to 5 common, full job titles that start with or are related to their query.
Prioritize common and standard job titles.

User's Input: {{{query}}}

Return the suggestions in the specified JSON format.
`,
});

const suggestJobTitlesFlow = ai.defineFlow(
  {
    name: 'suggestJobTitlesFlow',
    inputSchema: SuggestJobTitlesInputSchema,
    outputSchema: SuggestJobTitlesOutputSchema,
  },
  async (input) => {
    if (input.query.length < 3) {
        return { titles: [] };
    }
    const { output } = await suggestJobTitlesPrompt(input);
    if (!output) {
      return { titles: [] };
    }
    return output;
  }
);
