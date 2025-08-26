"use client";

import type { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface DoneViewProps {
  tasks: Task[];
  onToggleCompletion: (taskId: string) => void;
}

export function DoneView({ tasks, onToggleCompletion }: DoneViewProps) {
  return (
    <div className="p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold md:text-3xl">Completed Tasks</h1>
        <p className="text-muted-foreground">Everything you've accomplished. Great work!</p>
      </header>
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <Card key={task.id} className="flex items-center p-3">
              <Checkbox 
                id={`done-${task.id}`}
                checked={task.completed} 
                onCheckedChange={() => onToggleCompletion(task.id)}
                className="mr-3"
              />
              <label htmlFor={`done-${task.id}`} className="flex-1 line-through text-muted-foreground">
                <span className="font-medium">{task.title}</span>
                {task.description && <p className="text-sm">{task.description}</p>}
              </label>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No completed tasks yet.</p>
            <p className="text-sm text-muted-foreground">Get started on a project to see your progress here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
