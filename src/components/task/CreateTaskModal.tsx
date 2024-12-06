"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskPriority, TaskStatus } from '@/types/Task';
import { v4 as uuidv4 } from 'uuid';
import { X, Save } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

export function CreateTaskModal({ isOpen, onClose, task }: CreateTaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('pending');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [assignee, setAssignee] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      if (task.startTime) {
        const startDate = new Date(task.startTime);
        setStartTime(startDate.toISOString().split('T')[0]);
        setSelectedStartDate(startDate);
      } else {
        setStartTime('');
        setSelectedStartDate(null);
      }
      if (task.endTime) {
        const endDate = new Date(task.endTime);
        setEndTime(endDate.toISOString().split('T')[0]);
        setSelectedEndDate(endDate);
      } else {
        setEndTime('');
        setSelectedEndDate(null);
      }
      setAssignee(task.assignee?.name || '');
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('pending');
    setStartTime('');
    setEndTime('');
    setAssignee('');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title,
      description,
      priority: priority as TaskPriority,
      status: status as TaskStatus,
      startTime: selectedStartDate ? selectedStartDate.toISOString() : null,
      endTime: selectedEndDate ? selectedEndDate.toISOString() : null,
      assignee: assignee ? { id: uuidv4(), name: assignee } : null,
      project: 'default',
      labels: [],
      isCompleted: status === 'completed',
      participants: [],
      comments: [],
      attachments: [],
      activity: [],
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      const newTask: Task = {
        ...taskData as Task,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addTask(newTask);
    }

    resetForm();
    onClose();
  };

  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
    setStartTime(date ? date.toISOString().split('T')[0] : '');
  };

  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
    setEndTime(date ? date.toISOString().split('T')[0] : '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la tâche"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la tâche"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="High">Haute</option>
                <option value="Medium">Moyenne</option>
                <option value="Low">Basse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">En attente</option>
                <option value="in-progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <Input
                type="date"
                value={startTime}
                onChange={(e) => handleStartDateChange(e.target.valueAsDate)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin
              </label>
              <Input
                type="date"
                value={endTime}
                onChange={(e) => handleEndDateChange(e.target.valueAsDate)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigné à
            </label>
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Nom de la personne"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {task ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}