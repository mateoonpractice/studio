"use client";

import { useState } from 'react';
import { MoreVertical, Plus, Trash2, Pencil, Lightbulb } from 'lucide-react';
import type { Project, Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ProjectForm } from './project-form';
import { TaskForm } from './task-form';
import { TaskItem } from './task-item';

interface ProjectViewProps {
  project: Project;
  tasks: Task[];
  allProjects: Project[];
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onMoveTask: (taskId: string, newProjectId: string) => void;
  onPrioritize: (projectId: string) => void;
}

export function ProjectView({ project, tasks, allProjects, onUpdateProject, onDeleteProject, onAddTask, ...taskHandlers }: ProjectViewProps) {
  const [isEditProjectOpen, setEditProjectOpen] = useState(false);
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);

  const handleProjectUpdate = (data: { name: string }) => {
    onUpdateProject({ ...project, ...data });
    setEditProjectOpen(false);
  };
  
  const handleTaskCreate = (data: { title: string, description?: string }) => {
    onAddTask({ ...data, projectId: project.id });
    setCreateTaskOpen(false);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      <header className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold md:text-3xl">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
           <Button onClick={() => taskHandlers.onPrioritize(project.id)} size="sm">
            <Lightbulb className="mr-2 h-4 w-4" />
            Prioritize with AI
          </Button>
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

          <AlertDialog>
            <Dialog open={isEditProjectOpen} onOpenChange={setEditProjectOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DialogTrigger asChild>
                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Project</DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />Delete Project
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader><DialogTitle>Edit Project</DialogTitle></DialogHeader>
                <ProjectForm onSubmit={handleProjectUpdate} defaultValues={project} />
              </DialogContent>
            </Dialog>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the project "{project.name}" and all its tasks. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteProject(project.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem key={task.id} task={task} allProjects={allProjects} {...taskHandlers} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active tasks in this project.</p>
              <p className="text-sm text-muted-foreground">Click "Add Task" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
