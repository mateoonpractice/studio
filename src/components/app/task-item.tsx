"use client";

import { useState } from 'react';
import type { Task, Project } from '@/lib/types';
import { MoreVertical, Pencil, Trash2, Move } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TaskForm } from './task-form';

interface TaskItemProps {
  task: Task;
  allProjects: Project[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  onMoveTask: (taskId: string, newProjectId: string) => void;
}

export function TaskItem({ task, allProjects, onUpdateTask, onDeleteTask, onToggleCompletion, onMoveTask }: TaskItemProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const handleUpdate = (data: { title: string, description?: string }) => {
    onUpdateTask({ ...task, ...data });
    setEditDialogOpen(false);
  };
  
  return (
    <Card className="p-3 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={task.id}
          checked={task.completed} 
          onCheckedChange={() => onToggleCompletion(task.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <label htmlFor={task.id} className="font-medium cursor-pointer">{task.title}</label>
          {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
        </div>
        
        <AlertDialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Move className="mr-2 h-4 w-4" /> Move to...
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {allProjects
                        .filter(p => p.id !== task.projectId)
                        .map(p => (
                          <DropdownMenuItem key={p.id} onClick={() => onMoveTask(task.id, p.id)}>
                            {p.name}
                          </DropdownMenuItem>
                        ))
                      }
                      {allProjects.filter(p => p.id !== task.projectId).length === 0 && (
                        <DropdownMenuItem disabled>No other projects</DropdownMenuItem>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
              <TaskForm onSubmit={handleUpdate} defaultValues={task} />
            </DialogContent>
          </Dialog>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the task "{task.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteTask(task.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
