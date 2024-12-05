export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'archived' | 'open' | 'closed';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
}

export interface TaskActivity {
  id: string;
  type: 'status_change' | 'assignment' | 'comment' | 'priority_change' | 'due_date_change';
  user: User;
  timestamp: Date;
  previousValue?: string;
  newValue?: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  labels: string[];
  isCompleted: boolean;
  startTime?: string | null;
  endTime?: string | null;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  dueDate?: string;
  estimatedTime?: number; // en minutes
  actualTime?: number; // en minutes
  participants: User[];
  assignee?: User | null;
  reporter?: User;
  parentTask?: string; // ID de la tâche parente
  subtasks?: string[]; // IDs des sous-tâches
  dependencies?: string[]; // IDs des tâches dont celle-ci dépend
  blockedBy?: string[]; // IDs des tâches qui bloquent celle-ci
  comments?: Comment[];
  done?: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedBy: User;
    uploadedAt: Date;
  }[];
  activity?: TaskActivity[];
  customFields?: {
    [key: string]: string | number | boolean | Date;
  };
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  labels?: string[];
  assignee?: string[];
  project?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  isCompleted?: boolean;
}

export interface TaskSort {
  field: keyof Task;
  direction: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  byPriority: {
    High: number;
    Medium: number;
    Low: number;
  };
}