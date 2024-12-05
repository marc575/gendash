import { Activity } from '@/store/dashboardStore';
import { Task } from '@/types/Task';

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Créer une interface moderne',
    description: 'Concevoir et implémenter une interface utilisateur moderne et intuitive',
    project: 'UI Design',
    status: 'closed',
    priority: 'High',
    labels: ['design', 'ui'],
    isCompleted: true,
    startTime: new Date('2024-01-05T09:00:00Z').toISOString(),
    endTime: new Date('2024-01-05T10:00:00Z').toISOString(),
    createdAt: new Date('2024-01-05T08:00:00Z').toISOString(),
    participants: [],
  },
  {
    id: '2',
    title: 'Optimiser les performances',
    description: 'Améliorer les performances de l\'application',
    project: 'Performance',
    status: 'open',
    priority: 'Medium',
    labels: ['performance', 'optimization'],
    isCompleted: false,
    startTime: new Date('2024-01-05T10:30:00Z').toISOString(),
    endTime: new Date('2024-01-05T12:30:00Z').toISOString(),
    createdAt: new Date('2024-01-05T10:00:00Z').toISOString(),
    participants: [],
  },
  {
    id: '3',
    title: 'Tester les fonctionnalités',
    description: 'Effectuer des tests complets des nouvelles fonctionnalités',
    project: 'Testing',
    status: 'open',
    priority: 'Low',
    labels: ['testing', 'qa'],
    isCompleted: false,
    startTime: new Date('2024-01-05T14:00:00Z').toISOString(),
    endTime: new Date('2024-01-05T16:00:00Z').toISOString(),
    createdAt: new Date('2024-01-05T13:00:00Z').toISOString(),
    participants: [],
  },
];

export const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'task_completed',
    action: 'Interface moderne créée avec succès',
    task: 'Créer une interface moderne',
    time: new Date('2024-01-05T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    type: 'task_created',
    action: 'Nouvelle tâche: Optimisation des performances',
    task: 'Optimiser les performances',
    time: new Date('2024-01-05T10:30:00Z').toISOString(),
  },
  {
    id: '3',
    type: 'task_created',
    action: 'Nouvelle tâche: Tests des fonctionnalités',
    task: 'Tester les fonctionnalités',
    time: new Date('2024-01-05T14:00:00Z').toISOString(),
  }
];
