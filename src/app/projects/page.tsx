"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { 
  Folder, 
  Plus, 
  Users, 
  Calendar,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  members: number;
  tasksCount: number;
  completedTasks: number;
  dueDate?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Refonte UI Dashboard',
    description: 'Modernisation complète de l\'interface utilisateur du tableau de bord',
    status: 'active',
    progress: 75,
    members: 4,
    tasksCount: 12,
    completedTasks: 9,
    dueDate: '2024-02-15'
  },
  {
    id: '2',
    name: 'API REST v2',
    description: 'Développement de la nouvelle version de l\'API REST',
    status: 'active',
    progress: 45,
    members: 3,
    tasksCount: 8,
    completedTasks: 3,
    dueDate: '2024-03-01'
  },
  {
    id: '3',
    name: 'Migration Base de données',
    description: 'Migration de la base de données vers la nouvelle architecture',
    status: 'completed',
    progress: 100,
    members: 2,
    tasksCount: 6,
    completedTasks: 6,
    dueDate: '2024-01-30'
  }
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const statusColors = {
    'active': 'bg-blue-400 text-white',
    'completed': 'bg-green-400 text-white',
    'on-hold': 'bg-yellow-400 text-white'
  };

  const statusLabels = {
    'active': 'En cours',
    'completed': 'Terminé',
    'on-hold': 'En pause'
  };

  return (
    <Card className="p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <Badge variant="secondary" className={cn(statusColors[project.status])}>
              {statusLabels[project.status]}
            </Badge>
          </div>
          <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-500">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <span>Progression</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="h-4 w-4" />
              <span>{project.members}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <CheckCircle2 className="h-4 w-4" />
              <span>{project.completedTasks}/{project.tasksCount}</span>
            </div>
          </div>
          {project.dueDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.dueDate).toLocaleDateString()}</span>
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default function Projects() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredProjects = mockProjects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Folder className="h-6 w-6 text-blue-600" />
            Projets
          </h1>
          <p className="text-gray-500">
            Gérez et suivez vos projets
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau projet
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button
            variant={filter === 'all' ? 'ghost-active' : 'ghost'}
            onClick={() => setFilter('all')}
            className="flex items-center gap-2"
          >
            Tous
            <Badge variant="secondary">{mockProjects.length}</Badge>
          </Button>
          <Button
            variant={filter === 'active' ? 'ghost-active' : 'ghost'}
            onClick={() => setFilter('active')}
            className="flex items-center gap-2"
          >
            En cours
            <Badge variant="secondary">
              {mockProjects.filter(p => p.status === 'active').length}
            </Badge>
          </Button>
          <Button
            variant={filter === 'completed' ? 'ghost-active' : 'ghost'}
            onClick={() => setFilter('completed')}
            className="flex items-center gap-2"
          >
            Terminés
            <Badge variant="secondary">
              {mockProjects.filter(p => p.status === 'completed').length}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Liste des projets */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
      )}>
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Message si aucun projet */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-500">Commencez par créer un nouveau projet</p>
        </div>
      )}
    </div>
  );
}