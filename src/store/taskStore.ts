import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskFilter, TaskSort, TaskStats, TaskActivity, User, TaskStatus, TaskPriority } from '@/types/Task';
import { sampleTasks } from '@/data/sampleTasks';

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
      Low: 0,
    },
    byStatus: {
      Open: 0,
      'In Progress': 0,
      Closed: 0,
      Archived: 0,
    },
    byLabel: {
      Bug: 0,
      Feature: 0,
      Documentation: 0,
      Design: 0,
      Testing: 0,
    },
    byAssignee: {},
  };

  tasks.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'Closed':
        stats.completed++;
        break;
      case 'In Progress':
        stats.inProgress++;
        break;
      case 'Open':
        stats.pending++;
        break;
      case 'Archived':
        stats.cancelled++;
        break;
    }

    // Count by priority
    stats.byPriority[task.priority]++;

    // Count by status
    stats.byStatus[task.status]++;

    // Count by label
    task.labels?.forEach(label => {
      stats.byLabel[label]++;
    });

    // Count by assignee
    if (task.assignee) {
      stats.byAssignee[task.assignee.id] = (stats.byAssignee[task.assignee.id] || 0) + 1;
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
  addAttachment: (taskId: string, attachment: Task['attachments'][0]) => void;
  assignTask: (taskId: string, userId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  addTaskLabel: (taskId: string, label: Task['labels'][0]) => void;
  removeTaskLabel: (taskId: string, label: Task['labels'][0]) => void;
  archiveTask: (taskId: string) => void;
  calculateStats: () => TaskStats;
  reorderTasks: (newTasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: sampleTasks,
      filter: {},
      sort: { field: 'createdAt', direction: 'desc' },
      stats: calculateStats(sampleTasks),

      addTask: (task: Task) => {
        set((state) => {
          const newTasks = [...state.tasks, {
            ...task,
            labels: task.labels || [],
            priority: task.priority || 'Medium',
            createdAt: new Date(),
            updatedAt: new Date()
          }];
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        set((state) => {
          const newTasks = state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date(),
                }
              : task
          );
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      deleteTask: (taskId: string) => {
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.id !== taskId);
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      setFilter: (filter: TaskFilter) => {
        set({ filter });
      },

      setSort: (sort: TaskSort) => {
        set({ sort });
      },

      addComment: (taskId: string, content: string, user: User) => {
        const comment = {
          id: Math.random().toString(36).substr(2, 9),
          content,
          author: user,
          createdAt: new Date(),
        };

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [...(task.comments || []), comment],
                  activity: [
                    ...(task.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'comment',
                      user,
                      timestamp: new Date(),
                      description: 'added a comment',
                    },
                  ],
                }
              : task
          ),
        }));
      },

      addAttachment: (taskId: string, attachment) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  attachments: [...(task.attachments || []), attachment],
                }
              : task
          ),
        }));
      },

      assignTask: (taskId: string, userId: string) => {
        const { tasks } = get();
        const user = tasks
          .flatMap((t) => t.participants)
          .find((p) => p.id === userId);

        if (user) {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    assignee: user,
                    activity: [
                      ...(task.activity || []),
                      {
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'assignment',
                        user,
                        timestamp: new Date(),
                        description: `assigned to ${user.name}`,
                      },
                    ],
                  }
                : task
            ),
          }));
        }
      },

      updateTaskStatus: (taskId: string, newStatus: TaskStatus) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'Closed' ? new Date() : t.completedAt,
                  updatedAt: new Date(),
                  activity: [
                    ...(t.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'status_change',
                      user: t.assignee || t.participants[0],
                      timestamp: new Date(),
                      previousValue: t.status,
                      newValue: newStatus,
                    },
                  ],
                }
              : t
          );

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks),
          };
        });
      },

      addSubtask: (parentId: string, subtask: Task) => {
        set((state) => {
          const parentTask = state.tasks.find(t => t.id === parentId);
          if (!parentTask) return state;

          const newSubtask = {
            ...subtask,
            parentTask: parentId,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const updatedTasks = [
            ...state.tasks.map(task => 
              task.id === parentId 
                ? {
                    ...task,
                    subtasks: [...(task.subtasks || []), newSubtask.id],
                    updatedAt: new Date()
                  }
                : task
            ),
            newSubtask
          ];

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks)
          };
        });
      },

      updateTaskPriority: (taskId: string, priority: TaskPriority) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  priority,
                  updatedAt: new Date(),
                  activity: [
                    ...(t.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'priority_change',
                      user: t.assignee || t.participants[0],
                      timestamp: new Date(),
                      previousValue: t.priority,
                      newValue: priority,
                    },
                  ],
                }
              : t
          );

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks)
          };
        });
      },

      addTaskLabel: (taskId: string, label) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId && !t.labels?.includes(label)
              ? {
                  ...t,
                  labels: [...(t.labels || []), label],
                  updatedAt: new Date(),
                  activity: [
                    ...(t.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'label_added',
                      user: t.assignee || t.participants[0],
                      timestamp: new Date(),
                      newValue: label,
                    },
                  ],
                }
              : t
          );

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks)
          };
        });
      },

      removeTaskLabel: (taskId: string, label) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  labels: (t.labels || []).filter((l) => l !== label),
                  updatedAt: new Date(),
                  activity: [
                    ...(t.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'label_removed',
                      user: t.assignee || t.participants[0],
                      timestamp: new Date(),
                      previousValue: label,
                    },
                  ],
                }
              : t
          );

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks)
          };
        });
      },

      archiveTask: (taskId: string) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === taskId);
          if (!task) return state;

          const updatedTasks = state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: 'Archived' as TaskStatus,
                  updatedAt: new Date(),
                  archivedAt: new Date(),
                  activity: [
                    ...(t.activity || []),
                    {
                      id: Math.random().toString(36).substr(2, 9),
                      type: 'status_change',
                      user: t.assignee || t.participants[0],
                      timestamp: new Date(),
                      previousValue: t.status,
                      newValue: 'Archived',
                    },
                  ],
                }
              : t
          );

          return {
            tasks: updatedTasks,
            stats: calculateStats(updatedTasks)
          };
        });
      },

      calculateStats: () => {
        const { tasks } = get();
        return calculateStats(tasks);
      },

      reorderTasks: (newTasks: Task[]) => {
        set(() => ({
          tasks: newTasks,
          stats: calculateStats(newTasks)
        }));
      },
    }),
    {
      name: 'task-store',
      version: 1,
    }
  )
);