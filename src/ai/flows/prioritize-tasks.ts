'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing tasks based on deadlines and project goals.
 *
 * - prioritizeTasks - A function that takes task details and project goals, and suggests task priorities.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      description: z.string().describe('A detailed description of the task.'),
      deadline: z.string().optional().describe('The deadline for the task (YYYY-MM-DD).'),
    })
  ).describe('A list of tasks to prioritize.'),
  projectGoals: z.string().describe('The overall goals of the project.'),
});
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.object({
  prioritizedTasks: z.array(
    z.object({
      title: z.string().describe('The title of the task.'),
      priority: z.string().describe('The suggested priority of the task (High, Medium, Low).'),
      reason: z.string().describe('The reasoning behind the assigned priority.'),
    })
  ).describe('A list of tasks with their suggested priorities and reasons.'),
});
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI task prioritization assistant. Given a list of tasks and the overall project goals, you will suggest a priority (High, Medium, Low) for each task and provide a reason for the assigned priority.

Project Goals: {{{projectGoals}}}

Tasks:
{{#each tasks}}
- Title: {{{title}}}, Description: {{{description}}}, Deadline: {{{deadline}}}
{{/each}}

Prioritized Tasks (Output in JSON format):
`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
