import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTasks, initialActivities } from '@/data/initialData';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  time: string;
  priority: 'low' | 'medium' | 'high';
  status: 'all' | 'open' | 'closed' | 'archived';
}

export type ActivityType = 'task_completed' | 'task_created' | 'comment_added' | 'task_updated' | 'task_deleted';

export interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  task: string;
  time: string;
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
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      tasks: initialTasks,
      activities: initialActivities,
      taskFilter: 'all',
      activityFilter: 'all',
      viewMode: 'list',
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
          ),
          activities: [
            {
              id: Date.now().toString(),
              type: 'task_completed',
              action: 'a marqué comme terminé',
              task: state.tasks.find((t) => t.id === id)?.title || '',
              time: new Date().toISOString(),
            },
            ...state.activities,
          ],
        })),
      updateTask: (taskId, updates) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          );

          const newActivity = {
            id: Date.now().toString(),
            type: 'task_updated' as ActivityType,
            action: 'Tâche mise à jour',
            task: task.title,
            time: new Date().toISOString(),
          };

          return {
            ...state,
            tasks: updatedTasks,
            activities: [newActivity, ...state.activities],
          };
        });
      },
      deleteTask: (taskId) =>
        set((state) => {
          const taskTitle = state.tasks.find((t) => t.id === taskId)?.title || '';
          return {
            tasks: state.tasks.filter((task) => task.id !== taskId),
            activities: [
              {
                id: Date.now().toString(),
                type: 'task_deleted',
                action: 'a supprimé',
                task: taskTitle,
                time: new Date().toISOString(),
              },
              ...state.activities,
            ],
          };
        }),
      reorderTasks: (newTasks) => set({ tasks: newTasks }),
      setTaskFilter: (filter) => set({ taskFilter: filter }),
      setActivityFilter: (filter) => set({ activityFilter: filter }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);
