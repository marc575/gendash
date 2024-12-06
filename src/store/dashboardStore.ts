import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTasks, initialActivities } from '@/data/initialData';
import { Task } from '@/types/Task';

export type ActivityType = 
  | 'task_completed' 
  | 'task_created' 
  | 'comment_added' 
  | 'task_updated' 
  | 'task_deleted'
  | 'status_change'
  | 'assignment'
  | 'priority_change'
  | 'label_added'
  | 'label_removed'
  | 'task_archived';

export interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  task: string;
  time: string;
  previousValue?: string;
  newValue?: string;
  user?: { id: string; name: string };
}

export type ViewMode = 'list' | 'grid';

export type TaskStatus = 'all' | 'open' | 'closed' | 'archived';

interface DashboardState {
  tasks: Task[];
  activities: Activity[];
  taskFilter: TaskStatus;
  activityFilter: ActivityType | 'all';
  viewMode: ViewMode;
  toggleTask: (id: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  setTaskFilter: (filter: TaskStatus) => void;
  setActivityFilter: (filter: ActivityType | 'all') => void;
  setViewMode: (mode: ViewMode) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      activities: initialActivities,
      taskFilter: 'all',
      activityFilter: 'all',
      viewMode: 'list',

      toggleTask: (id: string): void => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
          ),
        }));
      },

      updateTask: (taskId: string, updates: Partial<Task>): void => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (taskId: string): void => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      reorderTasks: (newTasks: Task[]): void => {
        set({ tasks: newTasks });
      },

      setTaskFilter: (filter: TaskStatus): void => {
        set({ taskFilter: filter });
      },

      setActivityFilter: (filter: ActivityType | 'all'): void => {
        set({ activityFilter: filter });
      },

      setViewMode: (mode: ViewMode): void => {
        set({ viewMode: mode });
      },

      addActivity: (activity: Omit<Activity, 'id' | 'time'>): void => {
        const newActivity: Activity = {
          id: crypto.randomUUID(),
          time: new Date().toISOString(),
          ...activity,
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));
      },
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
