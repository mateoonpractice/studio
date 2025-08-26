import type { Project, Task } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
  },
  {
    id: 'proj-2',
    name: 'Q3 Marketing Campaign',
  },
  {
    id: 'proj-3',
    name: 'Personal Goals',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Design new homepage mockup',
    description: 'Create a high-fidelity mockup in Figma.',
    completed: false,
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Develop front-end components',
    description: 'Code the main UI components in React.',
    completed: false,
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Setup staging environment',
    description: 'Deploy the new website to a staging server for testing.',
    completed: true,
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    title: 'Finalize campaign budget',
    description: 'Review and approve the budget for all marketing channels.',
    completed: false,
  },
  {
    id: 'task-5',
    projectId: 'proj-2',
    title: 'Create social media content calendar',
    completed: false,
  },
  {
    id: 'task-6',
    projectId: 'proj-3',
    title: 'Read "Atomic Habits"',
    description: 'Finish reading the book by James Clear.',
    completed: false,
  },
  {
    id: 'task-7',
    projectId: 'proj-3',
    title: 'Go for a 5k run',
    completed: true,
  },
];
