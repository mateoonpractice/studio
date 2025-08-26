"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Project, Task } from '@/lib/types';
import { INITIAL_PROJECTS, INITIAL_TASKS } from '@/lib/data';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { ProjectView } from '@/components/app/project-view';
import { DoneView } from '@/components/app/done-view';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { prioritizeTasks } from '@/ai/flows/prioritize-tasks';

export default function AppLayout() {
  const [isClient, setIsClient] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState('proj-1'); // 'done' or project id
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const savedProjects = localStorage.getItem('mate-todo-projects');
    const savedTasks = localStorage.getItem('mate-todo-tasks');

    if (savedProjects && savedTasks) {
      setProjects(JSON.parse(savedProjects));
      setTasks(JSON.parse(savedTasks));
    } else {
      setProjects(INITIAL_PROJECTS);
      setTasks(INITIAL_TASKS);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('mate-todo-projects', JSON.stringify(projects));
      localStorage.setItem('mate-todo-tasks', JSON.stringify(tasks));
    }
  }, [projects, tasks, isClient]);
  
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: `proj-${Date.now()}` };
    setProjects([...projects, newProject]);
    setActiveView(newProject.id);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };
  
  const deleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setTasks(tasks.filter(t => t.projectId !== projectId));
    if (activeView === projectId) {
      setActiveView(projects.length > 1 ? projects.find(p => p.id !== projectId)!.id : 'done');
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask = { ...task, id: `task-${Date.now()}`, completed: false };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const moveTask = (taskId: string, newProjectId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, projectId: newProjectId } : t));
  };

  const handlePrioritize = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const projectTasks = tasks.filter(t => t.projectId === projectId && !t.completed);

    if (projectTasks.length === 0) {
      toast({
        title: "No tasks to prioritize",
        description: "Add some tasks to this project first.",
      });
      return;
    }

    try {
       toast({
        title: "AI is thinking...",
        description: "Prioritizing your tasks based on project goals.",
      });
      const result = await prioritizeTasks({
        tasks: projectTasks.map(({ title, description }) => ({ title, description: description || '' })),
        projectGoals: project.description || project.name,
      });

      const updatedTasks = tasks.map(task => {
        const prioritized = result.prioritizedTasks.find(pt => pt.title === task.title);
        if (prioritized) {
          return { ...task, priority: prioritized.priority as Task['priority'], reason: prioritized.reason };
        }
        return task;
      });

      setTasks(updatedTasks);
      toast({
        title: "Success!",
        description: "Tasks have been prioritized by AI.",
        variant: "default",
      });

    } catch (error) {
      console.error("AI Prioritization Error:", error);
      toast({
        title: "Error",
        description: "Could not prioritize tasks. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const activeProject = useMemo(() => projects.find(p => p.id === activeView), [projects, activeView]);
  const tasksForProject = useMemo(() => tasks.filter(t => t.projectId === activeView && !t.completed), [tasks, activeView]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav 
          projects={projects}
          activeView={activeView}
          setActiveView={setActiveView}
          onAddProject={addProject}
        />
      </Sidebar>
      <SidebarInset>
        {activeView === 'done' ? (
          <DoneView tasks={completedTasks} onToggleCompletion={toggleTaskCompletion} />
        ) : activeProject ? (
          <ProjectView
            key={activeProject.id}
            project={activeProject}
            tasks={tasksForProject}
            allProjects={projects}
            onUpdateProject={updateProject}
            onDeleteProject={deleteProject}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleCompletion={toggleTaskCompletion}
            onMoveTask={moveTask}
            onPrioritize={handlePrioritize}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a project or create a new one to get started.</p>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
