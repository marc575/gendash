import { Task, Activity } from '@/store/dashboardStore';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Créer une interface moderne',
    done: true,
    time: new Date('2024-01-05T09:00:00Z').toISOString(),
    priority: 'high',
    status: 'closed'
  },
  {
    id: '2',
    title: 'Implémenter le glisser-déposer',
    done: false,
    time: new Date('2024-01-05T10:30:00Z').toISOString(),
    priority: 'medium',
    status: 'open'
  },
  {
    id: '3',
    title: 'Ajouter des animations fluides',
    done: false,
    time: new Date('2024-01-05T14:00:00Z').toISOString(),
    priority: 'low',
    status: 'open'
  },
];

export const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    action: 'Tâche terminée',
    task: 'Créer une interface moderne',
    time: new Date('2024-01-05T14:00:00Z').toISOString(),
  },
  {
    id: '2',
    type: 'comment_added',
    action: 'Commentaire ajouté',
    task: 'Implémenter le glisser-déposer',
    time: new Date('2024-01-05T13:00:00Z').toISOString(),
  },
  {
    id: '3',
    type: 'task_created',
    action: 'Tâche créée',
    task: 'Ajouter des animations fluides',
    time: new Date('2024-01-05T12:00:00Z').toISOString(),
  },
];
