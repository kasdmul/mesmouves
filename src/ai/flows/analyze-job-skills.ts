'use server';

/**
 * @fileOverview A job skill analyzer AI agent.
 *
 * - analyzeJobSkills - A function that handles the job skill analysis process.
 * - AnalyzeJobSkillsInput - The input type for the analyzeJobSkills function.
 * - AnalyzeJobSkillsOutput - The return type for the analyzeJobSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJobSkillsInputSchema = z.object({
  jobDescriptions: z
    .array(z.string())
    .describe('An array of job descriptions to analyze.'),
});
export type AnalyzeJobSkillsInput = z.infer<typeof AnalyzeJobSkillsInputSchema>;

const AnalyzeJobSkillsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the most common and important skills mentioned in the job descriptions.'
    ),
});
export type AnalyzeJobSkillsOutput = z.infer<typeof AnalyzeJobSkillsOutputSchema>;

export async function analyzeJobSkills(
  input: AnalyzeJobSkillsInput
): Promise<AnalyzeJobSkillsOutput> {
  return analyzeJobSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJobSkillsPrompt',
  input: {schema: AnalyzeJobSkillsInputSchema},
  output: {schema: AnalyzeJobSkillsOutputSchema},
  prompt: `You are an HR analyst expert. Your goal is to identify common skills and skill gaps across multiple job descriptions.

  Analyze the following job descriptions and provide a summary of the most common and important skills mentioned. Focus on identifying trends and potential gaps.

  Job Descriptions:
  {{#each jobDescriptions}}
  - {{{this}}}
  {{/each}}`,
});

const analyzeJobSkillsFlow = ai.defineFlow(
  {
    name: 'analyzeJobSkillsFlow',
    inputSchema: AnalyzeJobSkillsInputSchema,
    outputSchema: AnalyzeJobSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
