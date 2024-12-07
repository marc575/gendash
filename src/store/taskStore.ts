import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, TaskPriority, User } from '@/types/Task';
import { initialTasks } from '@/data/initialData';

// Types pour le filtre et le tri
interface TaskFilter {
  status: TaskStatus[];
  priority: TaskPriority[];
  labels: string[];
  assignee: string[];
  project: string[];
  isCompleted: boolean;
}

interface TaskSort {
  field: keyof Task;
  direction: 'asc' | 'desc';
}

// Types pour les statistiques
interface TaskStats {
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
  byLabel: Record<string, number>;
  byAssignee: Record<string, number>;
  byStatus: {
    open: number;
    closed: number;
    completed: number;
    archived: number;
  };
}

const calculateStats = (tasks: Task[]): TaskStats => {
  const stats: TaskStats = {
    total: tasks.length,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0,
    byPriority: {
      High: 0,
      Medium: 0,
      Low: 0
    },
    byLabel: {},
    byAssignee: {},
    byStatus: {
      open: 0,
      closed: 0,
      completed: 0,
      archived: 0,
    },
  };

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'completed':
        stats.completed++;
        stats.byStatus.completed++;
        break;
      case 'open':
        stats.inProgress++;
        stats.byStatus.open++;
        break;
      case 'closed':
        stats.cancelled++;
        stats.byStatus.closed++;
        break;
      case 'archived':
        stats.cancelled++;
        stats.byStatus.archived++;
        break;
      default:
        stats.pending++;
        break;
    }

    // Count by priority
    if (task.priority) {
      stats.byPriority[task.priority]++;
    }

    // Count by label
    if (task.labels && Array.isArray(task.labels)) {
      task.labels.forEach(label => {
        stats.byLabel[label] = (stats.byLabel[label] || 0) + 1;
      });
    }

    // Count by assignee
    if (task.assignee) {
      const assigneeId = task.assignee.id;
      stats.byAssignee[assigneeId] = (stats.byAssignee[assigneeId] || 0) + 1;
    }
  });

  return stats;
};

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  sort: TaskSort;
  stats: TaskStats;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setFilter: (filter: TaskFilter) => void;
  setSort: (sort: TaskSort) => void;
  addComment: (taskId: string, content: string, user: User) => void;
  addAttachment: (taskId: string, attachment: Omit<NonNullable<Task['attachments']>[0], 'id'>) => void;
  assignTask: (taskId: string, userId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  addTaskLabel: (taskId: string, label: string) => void;
  removeTaskLabel: (taskId: string, label: string) => void;
  archiveTask: (taskId: string) => void;
  calculateStats: () => TaskStats;
  reorderTasks: (newTasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      filter: {
        status: [],
        priority: [],
        labels: [],
        assignee: [],
        project: [],
        isCompleted: false,
      },
      sort: {
        field: 'createdAt',
        direction: 'desc',
      },
      stats: calculateStats(initialTasks),

      addTask: (task: Task) => {
        const newTasks = [...get().tasks, task];
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        const newTasks = get().tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      deleteTask: (taskId: string) => {
        const newTasks = get().tasks.filter((task) => task.id !== taskId);
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      setFilter: (filter: TaskFilter) => set({ filter }),

      setSort: (sort: TaskSort) => set({ sort }),

      addComment: (taskId: string, content: string, user: User) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              comments: [
                ...(task.comments || []),
                {
                  id: crypto.randomUUID(),
                  content,
                  author: user,
                  createdAt: new Date(),
                },
              ],
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      addAttachment: (taskId: string, attachment: Omit<NonNullable<Task['attachments']>[0], 'id'>) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              attachments: [
                ...(task.attachments || []),
                {
                  id: crypto.randomUUID(),
                  ...attachment,
                },
              ],
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      assignTask: (taskId: string, userId: string) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            // Trouver l'utilisateur dans la liste des participants
            const assignee = task.participants.find(
              (participant) => participant.id === userId
            );
            if (assignee) {
              return {
                ...task,
                assignee,
              };
            }
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      updateTaskStatus: (taskId: string, newStatus: TaskStatus) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            const updates: Partial<Task> = {
              status: newStatus,
            };

            if (newStatus === 'completed') {
              updates.completedAt = new Date().toISOString();
              updates.done = true;
            } else if (newStatus === 'archived') {
              updates.done = true;
            }

            return {
              ...task,
              ...updates,
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      addSubtask: (parentId: string, subtask: Task) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === parentId) {
            return {
              ...task,
              subtasks: [...(task.subtasks || []), subtask.id],
            };
          }
          return task;
        });
        set({ tasks: [...newTasks, subtask], stats: calculateStats([...newTasks, subtask]) });
      },

      updateTaskPriority: (taskId: string, priority: TaskPriority) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            const updates: Partial<Task> = {
              priority,
              updatedAt: new Date().toISOString(),
            };

            return {
              ...task,
              ...updates,
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      addTaskLabel: (taskId: string, label: string) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId && !task.labels.includes(label)) {
            return {
              ...task,
              labels: [...task.labels, label],
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      removeTaskLabel: (taskId: string, label: string) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              labels: task.labels.filter((l) => l !== label),
              updatedAt: new Date().toISOString(),
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      archiveTask: (taskId: string) => {
        const newTasks = get().tasks.map((task) => {
          if (task.id === taskId) {
            const updates: Partial<Task> = {
              status: 'archived',
              done: true,
              updatedAt: new Date().toISOString(),
            };

            return {
              ...task,
              ...updates,
            };
          }
          return task;
        });
        set({ tasks: newTasks, stats: calculateStats(newTasks) });
      },

      calculateStats: () => calculateStats(get().tasks),

      reorderTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
    }),
    {
      name: 'task-store',
      version: 1,
      storage: {
        getItem: (name: string) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);