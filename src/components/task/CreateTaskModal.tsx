"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { MultiSelect, Option } from '@/components/ui/MultiSelect';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskStatus, TaskPriority } from '@/types/Task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function CreateTaskModal({ isOpen, onClose, task }: CreateTaskModalProps) {
  const { addTask, updateTask } = useTaskStore();

  const [newTask, setNewTask] = useState<Task>({
    id: task?.id || '',
    title: task?.title || '',
    description: task?.description || '',
    project: task?.project || '',
    status: task?.status || 'open',
    priority: task?.priority || 'Medium',
    labels: task?.labels || [],
    isCompleted: task?.isCompleted || false,
    startTime: task?.startTime || null,
    endTime: task?.endTime || null,
    createdAt: task?.createdAt || new Date().toISOString(),
    estimatedTime: task?.estimatedTime || 0,
    actualTime: task?.actualTime || 0,
    participants: task?.participants || [],
    assignee: task?.assignee || null,
    parentTask: task?.parentTask || undefined,
    subtasks: task?.subtasks || [],
    dependencies: task?.dependencies || [],
    blockedBy: task?.blockedBy || [],
    comments: task?.comments || [],
    attachments: task?.attachments || [],
    activity: task?.activity || [],
    customFields: task?.customFields || {}
  });

  useEffect(() => {
    if (task) {
      setNewTask({
        ...task,
        participants: task.participants || []
      });
    } else {
      setNewTask({
        id: '',
        title: '',
        description: '',
        project: '',
        status: 'open',
        priority: 'Medium',
        labels: [],
        isCompleted: false,
        startTime: null,
        endTime: null,
        createdAt: new Date().toISOString(),
        estimatedTime: 0,
        actualTime: 0,
        participants: [],
        assignee: null,
        parentTask: undefined,
        subtasks: [],
        dependencies: [],
        blockedBy: [],
        comments: [],
        attachments: [],
        activity: [],
        customFields: {}
      });
    }
  }, [task]);

  // Ajout des données de test pour les utilisateurs (à remplacer par des données réelles)
  const availableUsers: Option[] = [
    { value: "1", label: "John Doe" },
    { value: "2", label: "Jane Smith" },
    { value: "3", label: "Bob Johnson" },
  ];

  const selectedUsers = newTask.participants.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const handleParticipantsChange = (selected: Option[]) => {
    setNewTask({
      ...newTask,
      participants: selected.map(option => ({
        id: option.value,
        name: option.label,
      })),
    });
  };

  const handleSubmit = () => {
    if (!newTask.title.trim()) {
      return;
    }
    
    if (task) {
      // En mode édition, on garde l'ID existant
      updateTask(task.id, {
        ...newTask,
        id: task.id // On s'assure de garder l'ID original
      });
    } else {
      // En mode création, on génère un nouvel ID
      const taskWithId = {
        ...newTask,
        id: crypto.randomUUID()
      };
      addTask(taskWithId);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour {task ? 'modifier' : 'créer'} une tâche.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Entrez le titre de la tâche"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Projet</Label>
                <Input
                  id="project"
                  placeholder="Nom du projet"
                  value={newTask.project}
                  onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez la tâche en détail..."
                value={newTask.description}
                rows={3}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            {/* Statut et Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value: TaskStatus) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: TaskPriority) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">Haute</SelectItem>
                    <SelectItem value="Medium">Moyenne</SelectItem>
                    <SelectItem value="Low">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates et temps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Date de début</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={newTask.startTime?.slice(0, 16) || ''}
                  onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Date de fin</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={newTask.endTime?.slice(0, 16) || ''}
                  onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Temps estimé et réel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Temps estimé (minutes)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="0"
                  placeholder="Ex: 120"
                  value={newTask.estimatedTime || ''}
                  onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="actualTime">Temps réel (minutes)</Label>
                <Input
                  id="actualTime"
                  type="number"
                  min="0"
                  placeholder="Ex: 90"
                  value={newTask.actualTime || ''}
                  onChange={(e) => setNewTask({ ...newTask, actualTime: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            {/* Labels */}
            <div className="space-y-2">
              <Label htmlFor="labels">Labels</Label>
              <Input
                id="labels"
                placeholder="Ex: urgent, feature, bug (séparés par des virgules)"
                value={newTask.labels.join(', ')}
                onChange={(e) => setNewTask({
                  ...newTask,
                  labels: e.target.value.split(',').map(label => label.trim()).filter(Boolean)
                })}
              />
            </div>

            {/* Participants */}
            <div className="grid gap-2">
              <Label htmlFor="participants">Participants</Label>
              <MultiSelect
                options={availableUsers}
                selected={selectedUsers}
                onChange={handleParticipantsChange}
                placeholder="Select participants..."
              />
            </div>

            {/* Tâche parente et dépendances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentTask">Tâche parente (ID)</Label>
                <Input
                  id="parentTask"
                  placeholder="ID de la tâche parente"
                  value={newTask.parentTask || ''}
                  onChange={(e) => setNewTask({ ...newTask, parentTask: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dependencies">Dépendances (IDs séparés par des virgules)</Label>
                <Input
                  id="dependencies"
                  placeholder="Ex: task-1, task-2"
                  value={newTask.dependencies?.join(', ') || ''}
                  onChange={(e) => setNewTask({
                    ...newTask,
                    dependencies: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!newTask.title.trim()}
              >
                {task ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};