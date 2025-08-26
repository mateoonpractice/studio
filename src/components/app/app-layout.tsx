import type { Project, Task } from '@/lib/types';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
} from "firebase/firestore";
import AppClientLayout from './app-client-layout';

const UNCATEGORIZED_PROJECT_ID = 'uncategorized';
const UNCATEGORIZED_PROJECT_NAME = 'Uncategorized';


async function getProjects(): Promise<Project[]> {
  const projectsCollection = collection(db, 'projects');
  const projectsSnapshot = await getDocs(projectsCollection);
  let projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));

  if (!projectsData.some(p => p.id === UNCATEGORIZED_PROJECT_ID)) {
    const uncategorizedProject = { id: UNCATEGORIZED_PROJECT_ID, name: UNCATEGORIZED_PROJECT_NAME };
    projectsData.unshift(uncategorizedProject);
  }
  return projectsData;
}

async function getTasks(): Promise<Task[]> {
  const tasksCollection = collection(db, 'tasks');
  const tasksSnapshot = await getDocs(tasksCollection);
  return tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
}


export default async function AppLayout() {
  const projects = await getProjects();
  const tasks = await getTasks();

  return <AppClientLayout initialProjects={projects} initialTasks={tasks} />;
}
