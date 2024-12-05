import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, TaskPriority, User } from '@/types/Task';

// Event emitter pour la communication entre stores
const createEventEmitter = () => {
  const listeners: { [key: string]: Function[] } = {};
  return {
    emit: (event: string, data: any) => {
      if (listeners[event]) {
        listeners[event].forEach(listener => listener(data));
      }
    },
    on: (event: string, callback: Function) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
    }
  };
};

export const taskEvents = createEventEmitter();

const calculateStats = (tasks: Task[]) => {
  const stats = {
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
    byLabel: {} as Record<string, number>,
    byAssignee: {} as Record<string, number>,
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
  filter: any;
  sort: any;
  stats: any;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  setFilter: (filter: any) => void;
  setSort: (sort: any) => void;
  addComment: (taskId: string, content: string, user: User) => void;
  addAttachment: (taskId: string, attachment: Omit<NonNullable<Task['attachments']>[0], 'id'>) => void;
  assignTask: (taskId: string, userId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  addTaskLabel: (taskId: string, label: string) => void;
  removeTaskLabel: (taskId: string, label: string) => void;
  archiveTask: (taskId: string) => void;
  calculateStats: () => any;
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

      addTask: (task: Task) => {
        set((state) => {
          const newTasks = [...state.tasks, task];
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
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

      deleteTask: (taskId: string) => {
        set((state) => {
          const newTasks = state.tasks.filter((task) => task.id !== taskId);
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks),
          };
        });
      },

      setFilter: (filter: any) => {
        set({ filter });
      },

      setSort: (sort: any) => {
        set({ sort });
      },

      addComment: (taskId: string, content: string, user: User) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const newComment = {
                id: crypto.randomUUID(),
                content,
                author: user,
                createdAt: new Date(),
              };
              return {
                ...task,
                comments: [...(task.comments || []), newComment],
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

      addAttachment: (taskId: string, attachment) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const newAttachment = {
                ...attachment,
                id: crypto.randomUUID(),
                uploadedAt: new Date(),
              };
              taskEvents.emit('activity', {
                type: 'attachment_added',
                action: `Attachment ${attachment.name} added`,
                task: taskId,
                user: attachment.uploadedBy,
              });
              return {
                ...task,
                attachments: [...(task.attachments || []), newAttachment],
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

      assignTask: (taskId: string, userId: string) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const assignee = { id: userId, name: `User ${userId}` };
              taskEvents.emit('activity', {
                type: 'assignment',
                action: `Task assigned to ${assignee.name}`,
                task: taskId,
                user: assignee,
              });
              return {
                ...task,
                assignee,
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

      updateTaskStatus: (taskId: string, newStatus: TaskStatus) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              taskEvents.emit('activity', {
                type: 'status_change',
                action: `Status changed from ${task.status} to ${newStatus}`,
                task: taskId,
                previousValue: task.status,
                newValue: newStatus,
                user: task.assignee || { id: 'system', name: 'System' },
              });
              return {
                ...task,
                status: newStatus,
                completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt,
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

      addSubtask: (parentId: string, subtask: Task) => {
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

      updateTaskPriority: (taskId: string, priority: TaskPriority) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              taskEvents.emit('activity', {
                type: 'priority_change',
                action: `Priority changed from ${task.priority} to ${priority}`,
                task: taskId,
                previousValue: task.priority,
                newValue: priority,
                user: task.assignee || { id: 'system', name: 'System' },
              });
              return {
                ...task,
                priority,
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

      addTaskLabel: (taskId: string, label: string) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId && !task.labels.includes(label)) {
              taskEvents.emit('activity', {
                type: 'label_added',
                action: `Label "${label}" added`,
                task: taskId,
                user: task.assignee || { id: 'system', name: 'System' },
              });
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

      removeTaskLabel: (taskId: string, label: string) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedLabels = task.labels.filter((l) => l !== label);
              taskEvents.emit('activity', {
                type: 'label_removed',
                action: `Label "${label}" removed`,
                task: taskId,
                user: task.assignee || { id: 'system', name: 'System' },
              });
              return {
                ...task,
                labels: updatedLabels,
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

      archiveTask: (taskId: string) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const newStatus: TaskStatus = 'archived';
              taskEvents.emit('activity', {
                type: 'task_archived',
                action: 'Task archived',
                task: taskId,
                previousValue: task.status,
                newValue: newStatus,
                user: task.assignee || { id: 'system', name: 'System' },
              });
              return {
                ...task,
                status: newStatus,
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

      calculateStats: () => {
        const { tasks } = get();
        return calculateStats(tasks);
      },

      reorderTasks: (newTasks: Task[]) => {
        set({ tasks: newTasks });
      },
    }),
    {
      name: 'task-store',
      version: 1,
    }
  )
);