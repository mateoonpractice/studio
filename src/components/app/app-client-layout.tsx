"use client";

import { useState, useMemo } from 'react';
import type { Project, Task } from '@/lib/types';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { ProjectView } from '@/components/app/project-view';
import { DoneView } from '@/components/app/done-view';
import { AllTasksView } from '@/components/app/all-tasks-view';
import { useToast } from "@/hooks/use-toast";

const UNCATEGORIZED_PROJECT_ID = 'uncategorized';

interface AppClientLayoutProps {
  initialProjects: Project[];
  initialTasks: Task[];
}

export default function AppClientLayout({ initialProjects, initialTasks }: AppClientLayoutProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeView, setActiveView] = useState('all-tasks'); // 'all-tasks', 'done' or project id
  const { toast } = useToast();
  
  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), project);
      const newProject = { ...project, id: docRef.id };
      setProjects([...projects, newProject]);
      setActiveView(newProject.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error",
        description: "Could not create new project.",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (updatedProject: Project) => {
    if (updatedProject.id === UNCATEGORIZED_PROJECT_ID) {
      // Potentially update name in local state if we allow it
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      return;
    }
    try {
      const projectRef = doc(db, "projects", updatedProject.id);
      await updateDoc(projectRef, { name: updatedProject.name });
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        title: "Error",
        description: "Could not update project.",
        variant: "destructive",
      });
    }
  };
  
  const deleteProject = async (projectId: string) => {
    if (projectId === UNCATEGORIZED_PROJECT_ID) {
      toast({
          title: "Cannot delete",
          description: "The 'Uncategorized' project cannot be deleted.",
          variant: "destructive",
        });
      return;
    }
    try {
      const batch = writeBatch(db);
      
      // Delete project
      const projectRef = doc(db, "projects", projectId);
      batch.delete(projectRef);

      // Delete associated tasks
      const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
      const tasksSnapshot = await getDocs(q);
      tasksSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setProjects(projects.filter(p => p.id !== projectId));
      setTasks(tasks.filter(t => t.projectId !== projectId));
      if (activeView === projectId) {
        setActiveView('all-tasks');
      }
    } catch (e) {
      console.error("Error deleting project and tasks: ", e);
       toast({
        title: "Error",
        description: "Could not delete project.",
        variant: "destructive",
      });
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    try {
      // If projectId is not provided, it defaults to uncategorized.
      const newTaskData = { ...task, completed: false, projectId: task.projectId || UNCATEGORIZED_PROJECT_ID };
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      const newTask = { ...newTaskData, id: docRef.id };
      setTasks([...tasks, newTask]);
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error",
        description: "Could not add task.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (updatedTask: Task) => {
     try {
      const taskRef = doc(db, "tasks", updatedTask.id);
      const { id, ...taskData } = updatedTask;
      await updateDoc(taskRef, taskData);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        title: "Error",
        description: "Could not update task.",
        variant: "destructive",
      });
    }
  };
  
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Error deleting document: ", e);
       toast({
        title: "Error",
        description: "Could not delete task.",
        variant: "destructive",
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    } catch (e) {
      console.error("Error updating document: ", e);
      toast({
        title: "Error",
        description: "Could not update task status.",
        variant: "destructive",
      });
    }
  };

  const moveTask = async (taskId: string, newProjectId: string) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { projectId: newProjectId });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, projectId: newProjectId } : t));
    } catch (e) {
      console.error("Error updating document: ", e);
       toast({
        title: "Error",
        description: "Could not move task.",
        variant: "destructive",
      });
    }
  };

  const activeProject = useMemo(() => projects.find(p => p.id === activeView), [projects, activeView]);
  const tasksForProject = useMemo(() => tasks.filter(t => t.projectId === activeView && !t.completed), [tasks, activeView]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);
  const allIncompleteTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);

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
        {activeView === 'all-tasks' ? (
          <AllTasksView 
            tasks={allIncompleteTasks} 
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleCompletion={toggleTaskCompletion}
            onMoveTask={moveTask}
            allProjects={projects}
            onAddTask={addTask}
          />
        ) : activeView === 'done' ? (
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
