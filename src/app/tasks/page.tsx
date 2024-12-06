"use client";

import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Grid, List, Filter as FilterIcon, SlidersHorizontal } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { CreateTaskModal } from '@/components/task/CreateTaskModal';
import { TaskCard } from '@/components/task/TaskCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Task } from '@/types/Task';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@/components/ui/Card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/DropdownMenu';
import { Badge } from '@/components/ui/Badge';

type ViewMode = 'grid' | 'list';
type SortOption = 'priority' | 'date' | 'status';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function TasksPage() {
  const { tasks, deleteTask, reorderTasks, updateTaskStatus } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredAndSortedTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredAndSortedTasks.findIndex((task) => task.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setShowDeleteDialog(false);
      setSelectedTask(null);
    }
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTaskStatus(task.id, newStatus);
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedPriority) {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    if (selectedStatus) {
      filtered = filtered.filter(task => task.status === selectedStatus);
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'date':
          const dateA = a.startTime ? new Date(a.startTime).getTime() : 0;
          const dateB = b.startTime ? new Date(b.startTime).getTime() : 0;
          return dateB - dateA;
        case 'status':
          return (b.status === 'completed' ? 1 : 0) - (a.status === 'completed' ? 1 : 0);
        default:
          return 0;
      }
    });
  }, [tasks, searchQuery, sortBy, selectedPriority, selectedStatus]);

  const activeFiltersCount = [selectedPriority, selectedStatus].filter(Boolean).length;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b to-muted/20"
    >
      <div className="max-w-7xl mx-auto py-6 space-y-8">
        <motion.div variants={item} className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Tâches
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredAndSortedTasks.length} tâche{filteredAndSortedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvelle tâche
          </Button>
        </motion.div>

        <motion.div variants={item} className="grid gap-4 md:grid-cols-[1fr,auto,auto]">
          <Card className="p-2">
            <Input
              placeholder="Rechercher une tâche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0"
            />
          </Card>

          <Card className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Trier par
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setSortBy('priority')} className="gap-2">
                  Priorité {sortBy === 'priority' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('date')} className="gap-2">
                  Date {sortBy === 'date' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('status')} className="gap-2">
                  Statut {sortBy === 'status' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>

          <Card className="p-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-9"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2 relative">
                  <FilterIcon className="h-4 w-4" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedPriority(null)} className="gap-2">
                  Toutes les priorités
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority('High')} className="gap-2">
                  Haute {selectedPriority === 'High' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority('Medium')} className="gap-2">
                  Moyenne {selectedPriority === 'Medium' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedPriority('Low')} className="gap-2">
                  Basse {selectedPriority === 'Low' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus(null)} className="gap-2">
                  Tous les statuts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('completed')} className="gap-2">
                  Terminé {selectedStatus === 'completed' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('in-progress')} className="gap-2">
                  En cours {selectedStatus === 'in-progress' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('pending')} className="gap-2">
                  En attente {selectedStatus === 'pending' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus('cancelled')} className="gap-2">
                  Annulé {selectedStatus === 'cancelled' && <Badge>Actif</Badge>}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={filteredAndSortedTasks.map(t => t.id)} strategy={rectSortingStrategy}>
                <motion.div
                  variants={item}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {filteredAndSortedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </motion.div>
              </SortableContext>
            </DndContext>
          ) : (
            <motion.div variants={item} className="space-y-4">
              {filteredAndSortedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </motion.div>
          )}

          {filteredAndSortedTasks.length === 0 && (
            <motion.div
              variants={item}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <FilterIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">&quot;Aucune tâche trouvée&quot;</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer une nouvelle tâche'}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPriority(null);
                  setSelectedStatus(null);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        task={undefined}
      />

      <CreateTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask || undefined}
      />

      {selectedTask && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la tâche</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Êtes-vous sûr de vouloir supprimer la tâche &quot;{selectedTask.title}&quot; ?</p>
              <p className="text-sm text-muted-foreground mt-2">Cette action est irréversible.</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
