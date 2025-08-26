"use client";

import { useState } from 'react';
import { Folder, CheckCircle, Plus, Settings } from 'lucide-react';
import type { Project } from '@/lib/types';
import { 
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectForm } from './project-form';
import { Logo } from './logo';

interface SidebarNavProps {
  projects: Project[];
  activeView: string;
  setActiveView: (view: string) => void;
  onAddProject: (project: Omit<Project, 'id'>) => void;
}

export function SidebarNav({ projects, activeView, setActiveView, onAddProject }: SidebarNavProps) {
  const [isCreateProjectOpen, setCreateProjectOpen] = useState(false);

  const handleProjectCreate = (data: { name: string; description?: string }) => {
    onAddProject(data);
    setCreateProjectOpen(false);
  };
  
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-lg font-semibold">Mate To-Do</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActiveView('done')} isActive={activeView === 'done'}>
                <CheckCircle />
                <span>Done Tasks</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projects.map(project => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton onClick={() => setActiveView(project.id)} isActive={activeView === project.id}>
                  <Folder />
                  <span className="truncate">{project.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <Dialog open={isCreateProjectOpen} onOpenChange={setCreateProjectOpen}>
                <DialogTrigger asChild>
                   <Button variant="ghost" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm onSubmit={handleProjectCreate} />
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
