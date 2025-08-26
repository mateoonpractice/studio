"use client";

import type { Task, Project } from '@/lib/types';
import { TaskItem } from './task-item';

interface AllTasksViewProps {
  tasks: Task[];
  allProjects: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onMoveTask: (taskId: string, newProjectId: string) => void;
}

export function AllTasksView({ tasks, ...taskHandlers }: AllTasksViewProps) {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold md:text-3xl">All Tasks</h1>
        <p className="text-muted-foreground">All your incomplete tasks from all projects.</p>
      </header>
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} {...taskHandlers} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks here. Looks like you're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
