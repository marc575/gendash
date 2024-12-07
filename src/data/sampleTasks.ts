import { Task, User, Comment, TaskActivity } from '@/types/Task';
import { addDays, subDays } from 'date-fns';

// Utilisateurs d'exemple
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Marc Dubois',
    avatar: '/avatars/marc.jpg',
    email: 'marc.dubois@company.com',
    role: 'Chef de projet'
  },
  {
    id: '2',
    name: 'Sophie Martin',
    avatar: '/avatars/sophie.jpg',
    email: 'sophie.martin@company.com',
    role: 'Développeur senior'
  },
  {
    id: '3',
    name: 'Lucas Bernard',
    avatar: '/avatars/lucas.jpg',
    email: 'lucas.bernard@company.com',
    role: 'Designer UI/UX'
  },
  {
    id: '4',
    name: 'Emma Petit',
    avatar: '/avatars/emma.jpg',
    email: 'emma.petit@company.com',
    role: 'Développeur fullstack'
  }
];

// Commentaires d'exemple
const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'J\'ai commencé l\'implémentation de l\'authentification OAuth avec Google.',
    author: sampleUsers[1],
    createdAt: new Date(2024, 0, 21, 10, 30),
  },
  {
    id: '2',
    content: 'Les tests unitaires sont tous passés. On peut passer à la review.',
    author: sampleUsers[3],
    createdAt: new Date(2024, 0, 22, 15, 45),
  }
];

// Activités d'exemple
const sampleActivities: TaskActivity[] = [
  {
    id: '1',
    type: 'status_change',
    user: sampleUsers[1],
    timestamp: new Date(2024, 0, 21, 11, 0),
    previousValue: 'pending',
    newValue: 'in-progress',
    description: 'a changé le statut de "En attente" à "En cours"'
  },
  {
    id: '2',
    type: 'assignment',
    user: sampleUsers[0],
    timestamp: new Date(2024, 0, 21, 9, 30),
    newValue: sampleUsers[1].id,
    description: 'a assigné la tâche à Sophie Martin'
  }
];

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Implémenter l\'authentification OAuth',
    description: 'Intégrer l\'authentification OAuth avec support pour Google et GitHub. Inclure la gestion des tokens et la persistance de session.',
    project: 'Authentification',
    status: 'in-progress',
    priority: 'High',
    labels: ['backend', 'sécurité', 'feature'],
    isCompleted: false,
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 3).toISOString(),
    createdAt: new Date(2024, 0, 20, 9, 0).toISOString(),
    updatedAt: new Date(2024, 0, 21, 10, 30).toISOString(),
    dueDate: addDays(new Date(), 5).toISOString(),
    estimatedTime: 480, // 8 heures en minutes
    actualTime: 180, // 3 heures en minutes
    participants: [sampleUsers[0], sampleUsers[1]],
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    comments: [sampleComments[0]],
    attachments: [
      {
        id: '1',
        name: 'oauth-spec.pdf',
        url: '/files/oauth-spec.pdf',
        type: 'application/pdf',
        size: 2457600, // 2.4 MB
        uploadedBy: sampleUsers[0],
        uploadedAt: new Date(2024, 0, 20, 9, 30)
      }
    ],
    activity: [sampleActivities[0], sampleActivities[1]],
    customFields: {
      complexity: 'Moyenne',
      impact: 'Élevé',
      environment: 'Production'
    }
  },
  {
    id: '2',
    title: 'Optimiser les performances de l\'application',
    description: 'Analyser et améliorer les performances générales de l\'application. Focus sur le temps de chargement initial et la réactivité de l\'interface.',
    project: 'Performance',
    status: 'pending',
    priority: 'Medium',
    labels: ['performance', 'frontend', 'optimisation'],
    isCompleted: false,
    startTime: addDays(new Date(), 1).toISOString(),
    endTime: addDays(new Date(), 4).toISOString(),
    createdAt: new Date(2024, 0, 22, 14, 0).toISOString(),
    dueDate: addDays(new Date(), 7).toISOString(),
    estimatedTime: 1200, // 20 heures en minutes
    participants: [sampleUsers[3]],
    assignee: sampleUsers[3],
    reporter: sampleUsers[0],
    comments: [],
    attachments: [],
    activity: [],
    customFields: {
      complexity: 'Élevée',
      impact: 'Moyen',
      environment: 'Tous'
    }
  },
  {
    id: '3',
    title: 'Refonte de l\'interface utilisateur',
    description: 'Moderniser l\'interface utilisateur en suivant les dernières tendances de design. Implémenter un nouveau système de composants.',
    project: 'Design',
    status: 'in-progress',
    priority: 'High',
    labels: ['design', 'ui/ux', 'frontend'],
    isCompleted: false,
    startTime: subDays(new Date(), 2).toISOString(),
    endTime: addDays(new Date(), 5).toISOString(),
    createdAt: new Date(2024, 0, 19, 11, 0).toISOString(),
    updatedAt: new Date(2024, 0, 21, 16, 45).toISOString(),
    dueDate: addDays(new Date(), 10).toISOString(),
    estimatedTime: 2400, // 40 heures en minutes
    actualTime: 960, // 16 heures en minutes
    participants: [sampleUsers[2], sampleUsers[3]],
    assignee: sampleUsers[2],
    reporter: sampleUsers[0],
    comments: [],
    attachments: [
      {
        id: '2',
        name: 'design-system.fig',
        url: '/files/design-system.fig',
        type: 'application/figma',
        size: 5242880, // 5 MB
        uploadedBy: sampleUsers[2],
        uploadedAt: new Date(2024, 0, 19, 14, 30)
      }
    ],
    activity: [],
    customFields: {
      complexity: 'Élevée',
      impact: 'Élevé',
      environment: 'Tous'
    }
  },
  {
    id: '4',
    title: 'Correction du bug d\'affichage mobile',
    description: 'Le menu de navigation ne s\'affiche pas correctement sur les appareils mobiles en orientation paysage.',
    project: 'Bugs',
    status: 'completed',
    priority: 'High',
    labels: ['bug', 'mobile', 'ui'],
    isCompleted: true,
    startTime: subDays(new Date(), 1).toISOString(),
    endTime: new Date().toISOString(),
    createdAt: new Date(2024, 0, 23, 9, 0).toISOString(),
    completedAt: new Date().toISOString(),
    dueDate: addDays(new Date(), 1).toISOString(),
    estimatedTime: 240, // 4 heures en minutes
    actualTime: 180, // 3 heures en minutes
    participants: [sampleUsers[1]],
    assignee: sampleUsers[1],
    reporter: sampleUsers[2],
    comments: [sampleComments[1]],
    attachments: [
      {
        id: '3',
        name: 'bug-screen.png',
        url: '/files/bug-screen.png',
        type: 'image/png',
        size: 1048576, // 1 MB
        uploadedBy: sampleUsers[2],
        uploadedAt: new Date(2024, 0, 23, 9, 15)
      }
    ],
    activity: [],
    customFields: {
      complexity: 'Moyenne',
      impact: 'Élevé',
      environment: 'Mobile'
    }
  },
  {
    id: '5',
    title: 'Mise à jour de la documentation API',
    description: 'Mettre à jour la documentation de l\'API REST avec les nouveaux endpoints et les exemples de réponses.',
    project: 'Documentation',
    status: 'pending',
    priority: 'Low',
    labels: ['documentation', 'api'],
    isCompleted: false,
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addDays(new Date(), 4).toISOString(),
    createdAt: new Date(2024, 0, 24, 11, 30).toISOString(),
    dueDate: addDays(new Date(), 7).toISOString(),
    estimatedTime: 360, // 6 heures en minutes
    participants: [sampleUsers[1]],
    assignee: sampleUsers[1],
    reporter: sampleUsers[0],
    comments: [],
    attachments: [],
    activity: [],
    customFields: {
      complexity: 'Faible',
      impact: 'Moyen',
      environment: 'Documentation'
    }
  }
];

// Statistiques des tâches
export const taskStats = {
  total: sampleTasks.length,
  completed: sampleTasks.filter(task => task.status === 'completed').length,
  inProgress: sampleTasks.filter(task => task.status === 'in-progress').length,
  pending: sampleTasks.filter(task => task.status === 'pending').length,
  cancelled: sampleTasks.filter(task => task.status === 'cancelled').length,
  byPriority: {
    High: sampleTasks.filter(task => task.priority === 'High').length,
    Medium: sampleTasks.filter(task => task.priority === 'Medium').length,
    Low: sampleTasks.filter(task => task.priority === 'Low').length,
  }
};
