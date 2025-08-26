"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }).max(50),
  description: z.string().max(200).optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  onSubmit: (data: ProjectFormValues) => void;
  defaultValues?: Partial<ProjectFormValues>;
}

export function ProjectForm({ onSubmit, defaultValues }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || { name: '', description: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Q4 Launch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the project." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Save Project</Button>
        </div>
      </form>
    </Form>
  );
}
