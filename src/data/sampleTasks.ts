import { Task } from '@/types/Task';
import { addDays, subDays } from 'date-fns';

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Réunion équipe projet',
    description: 'Point hebdomadaire sur l\'avancement du projet',
    status: 'pending',
    priority: 'High',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 1).toISOString(),
    assignee: { id: '1', name: 'Marc Dupont' },
    labels: ['Réunion', 'Projet']
  },
  {
    id: '2',
    title: 'Présentation client',
    description: 'Présentation des nouvelles fonctionnalités',
    status: 'completed',
    priority: 'High',
    startTime: subDays(new Date(), 1).toISOString(),
    endTime: new Date().toISOString(),
    assignee: { id: '2', name: 'Sophie Martin' },
    labels: ['Client', 'Présentation']
  },
  {
    id: '3',
    title: 'Mise à jour documentation',
    description: 'Mettre à jour la documentation technique',
    status: 'in-progress',
    priority: 'Medium',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 2).toISOString(),
    assignee: { id: '3', name: 'Thomas Bernard' },
    labels: ['Documentation']
  },
  {
    id: '4',
    title: 'Debug application mobile',
    description: 'Corriger les bugs signalés sur l\'app mobile',
    status: 'in-progress',
    priority: 'High',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 1).toISOString(),
    labels: ['Bug', 'Mobile']
  },
  {
    id: '5',
    title: 'Formation React',
    description: 'Préparer la formation React pour les nouveaux',
    status: 'pending',
    priority: 'Medium',
    startTime: addDays(new Date(), 5).toISOString(),
    endTime: addDays(new Date(), 6).toISOString(),
    assignee: { id: '1', name: 'Marc Dupont' },
    labels: ['Formation', 'React']
  },
  {
    id: '6',
    title: 'Revue de code',
    description: 'Revue du code de la nouvelle fonctionnalité',
    status: 'completed',
    priority: 'Low',
    startTime: subDays(new Date(), 2).toISOString(),
    endTime: subDays(new Date(), 1).toISOString(),
    labels: ['Code', 'Review']
  },
  {
    id: '7',
    title: 'Optimisation performances',
    description: 'Optimiser les performances de l\'application',
    status: 'in-progress',
    priority: 'High',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 3).toISOString(),
    assignee: { id: '4', name: 'Julie Dubois' },
    labels: ['Performance', 'Optimisation']
  },
  {
    id: '8',
    title: 'Mise en production',
    description: 'Déploiement de la nouvelle version',
    status: 'pending',
    priority: 'High',
    startTime: addDays(new Date(), 1).toISOString(),
    endTime: addDays(new Date(), 2).toISOString(),
    labels: ['Déploiement', 'Production']
  },
  {
    id: '9',
    title: 'Tests automatisés',
    description: 'Écriture des tests automatisés',
    status: 'in-progress',
    priority: 'Medium',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 4).toISOString(),
    assignee: { id: '5', name: 'Pierre Martin' },
    labels: ['Tests', 'Automation']
  },
  {
    id: '10',
    title: 'Design système',
    description: 'Mise à jour du design système',
    status: 'completed',
    priority: 'Medium',
    startTime: subDays(new Date(), 3).toISOString(),
    endTime: subDays(new Date(), 1).toISOString(),
    assignee: { id: '6', name: 'Emma Petit' },
    labels: ['Design', 'UI']
  },
  {
    id: '11',
    title: 'Analyse des données',
    description: 'Analyse des données utilisateurs',
    status: 'pending',
    priority: 'Low',
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addDays(new Date(), 5).toISOString(),
    labels: ['Analyse', 'Data']
  },
  {
    id: '12',
    title: 'Support client',
    description: 'Répondre aux tickets support',
    status: 'in-progress',
    priority: 'Medium',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 1).toISOString(),
    assignee: { id: '7', name: 'Lucas Roux' },
    labels: ['Support', 'Client']
  },
  {
    id: '13',
    title: 'Migration base de données',
    description: 'Migration vers la nouvelle base de données',
    status: 'pending',
    priority: 'High',
    startTime: addDays(new Date(), 3).toISOString(),
    endTime: addDays(new Date(), 5).toISOString(),
    labels: ['Database', 'Migration']
  },
  {
    id: '14',
    title: 'Rapport mensuel',
    description: 'Préparation du rapport mensuel',
    status: 'completed',
    priority: 'Low',
    startTime: subDays(new Date(), 5).toISOString(),
    endTime: subDays(new Date(), 4).toISOString(),
    assignee: { id: '8', name: 'Sarah Durand' },
    labels: ['Rapport', 'Mensuel']
  },
  {
    id: '15',
    title: 'Mise à jour sécurité',
    description: 'Application des correctifs de sécurité',
    status: 'pending',
    priority: 'High',
    startTime: addDays(new Date(), 1).toISOString(),
    endTime: addDays(new Date(), 2).toISOString(),
    labels: ['Sécurité', 'Maintenance']
  },
  {
    id: '16',
    title: 'Intégration API',
    description: 'Intégration avec l\'API partenaire',
    status: 'in-progress',
    priority: 'Medium',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 3).toISOString(),
    assignee: { id: '9', name: 'Antoine Leroy' },
    labels: ['API', 'Integration']
  },
  {
    id: '17',
    title: 'Workshop UX',
    description: 'Workshop sur l\'expérience utilisateur',
    status: 'pending',
    priority: 'Low',
    startTime: addDays(new Date(), 4).toISOString(),
    endTime: addDays(new Date(), 5).toISOString(),
    labels: ['UX', 'Workshop']
  },
  {
    id: '18',
    title: 'Audit accessibilité',
    description: 'Audit d\'accessibilité du site',
    status: 'completed',
    priority: 'Medium',
    startTime: subDays(new Date(), 3).toISOString(),
    endTime: subDays(new Date(), 1).toISOString(),
    assignee: { id: '10', name: 'Marie Lambert' },
    labels: ['Accessibilité', 'Audit']
  },
  {
    id: '19',
    title: 'Refactoring code',
    description: 'Refactoring du code legacy',
    status: 'in-progress',
    priority: 'High',
    startTime: new Date().toISOString(),
    endTime: addDays(new Date(), 5).toISOString(),
    labels: ['Code', 'Refactoring']
  },
  {
    id: '20',
    title: 'Planification sprint',
    description: 'Planification du prochain sprint',
    status: 'pending',
    priority: 'Medium',
    startTime: addDays(new Date(), 2).toISOString(),
    endTime: addDays(new Date(), 3).toISOString(),
    assignee: { id: '1', name: 'Marc Dupont' },
    labels: ['Sprint', 'Planning']
  }
];
