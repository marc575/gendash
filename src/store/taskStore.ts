import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, TaskPriority, User } from '@/types/Task';

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

interface TaskEvent {
  taskId?: string;
  type: string;
  data: unknown;
}

type EventCallback = (event: TaskEvent) => void;

// Event emitter pour la communication entre stores
const createEventEmitter = () => {
  const listeners: { [key: string]: EventCallback[] } = {};
  
  return {
    emit: (event: string, data: unknown): void => {
      if (listeners[event]) {
        listeners[event].forEach((listener: EventCallback): void => {
          listener({ type: event, data });
        });
      }
    },
    on: (event: string, callback: EventCallback): void => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    }
  };
};

export const taskEvents = createEventEmitter();

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
    task.labels.forEach(label => {
      stats.byLabel[label] = (stats.byLabel[label] || 0) + 1;
    });

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
      tasks: [],
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
      stats: calculateStats([]),

      addTask: (task: Task): void => {
        set((state) => {
          const newTasks = [...state.tasks, task];
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      updateTask: (taskId: string, updates: Partial<Task>): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          );
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      deleteTask: (taskId: string): void => {
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.id !== taskId);
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      setFilter: (filter: TaskFilter): void => {
        set({ filter });
      },

      setSort: (sort: TaskSort): void => {
        set({ sort });
      },

      addComment: (taskId: string, content: string, user: User): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      addAttachment: (taskId: string, attachment: Omit<NonNullable<Task['attachments']>[0], 'id'>): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      assignTask: (taskId: string, userId: string): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      updateTaskStatus: (taskId: string, newStatus: TaskStatus): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      addSubtask: (parentId: string, subtask: Task): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === parentId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), subtask.id],
              };
            }
            return task;
          });
          return {
            tasks: [...newTasks, subtask],
            stats: calculateStats([...newTasks, subtask]),
          };
        });
      },

      updateTaskPriority: (taskId: string, priority: TaskPriority): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      addTaskLabel: (taskId: string, label: string): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId && !task.labels.includes(label)) {
              return {
                ...task,
                labels: [...task.labels, label],
                updatedAt: new Date().toISOString(),
              };
            }
            return task;
          });
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      removeTaskLabel: (taskId: string, label: string): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                labels: task.labels.filter((l) => l !== label),
                updatedAt: new Date().toISOString(),
              };
            }
            return task;
          });
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      archiveTask: (taskId: string): void => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
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
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      calculateStats: (): TaskStats => {
        const { tasks } = get();
        return calculateStats(tasks);
      },

      reorderTasks: (newTasks: Task[]): void => {
        set({ tasks: newTasks });
      },
    }),
    {
      name: 'task-store',
      version: 1,
    }
  )
);