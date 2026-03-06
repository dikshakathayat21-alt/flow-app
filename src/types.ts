export interface Note {
  id: string;
  title: string;
  content: string;
  links: string[];
  section: string;
  createdAt: number;
}

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  links: string[];
  createdAt: number;
}

export type View = 'home' | 'notes' | 'todo' | 'settings' | 'auth';
