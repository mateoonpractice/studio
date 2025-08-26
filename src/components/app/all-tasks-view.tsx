"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Task, Project } from '@/lib/types';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from './task-form';

interface AllTasksViewProps {
  tasks: Task[];
  allProjects: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onMoveTask: (taskId: string, newProjectId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'projectId'>) => void;
}

export function AllTasksView({ tasks, onAddTask, ...taskHandlers }: AllTasksViewProps) {
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  const handleTaskCreate = (data: { title: string, description?: string }) => {
    onAddTask(data);
    setCreateTaskOpen(false);
  };

  return (
    <div className="p-4 md:p-6">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">All Tasks</h1>
          <p className="text-muted-foreground">All your incomplete tasks from all projects.</p>
        </div>
        <Dialog open={isCreateTaskOpen} onOpenChange={setCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
            <TaskForm onSubmit={handleTaskCreate} />
          </DialogContent>
        </Dialog>
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
