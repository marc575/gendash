"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, LayoutList } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import { useTaskStore } from '@/store/taskStore';
import { CreateTaskModal } from '@/components/task/CreateTaskModal';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Task } from '@/types/Task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { SortableTask } from '@/components/task/SortableTask';
import { Badge } from '@/components/ui/Badge';
import { SearchInput } from '@/components/ui/SearchInput';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function TasksPage() {
  // 1. Store hooks
  const tasks = useTaskStore(state => state.tasks) || [];
  const reorderTasks = useTaskStore(state => state.reorderTasks);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const updateTaskStatus = useTaskStore(state => state.updateTaskStatus);

  // 2. State hooks
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'closed' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // 3. DnD hooks
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 4. Effect hooks
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // 5. Memoized values
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    return tasks.filter((task: Task) => {
      // Filtre par statut
      if (activeFilter === 'open') return task.status !== 'completed' && task.status !== 'archived';
      if (activeFilter === 'closed') return task.status === 'completed';
      if (activeFilter === 'archived') return task.status === 'archived';
      
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.project?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tasks, activeFilter, searchQuery]);

  const tasksByStatus = useMemo(() => {
    if (!Array.isArray(tasks)) return { open: 0, closed: 0, archived: 0 };
    
    return {
      open: tasks.filter(task => task.status !== 'completed' && task.status !== 'archived').length,
      closed: tasks.filter(task => task.status === 'completed').length,
      archived: tasks.filter(task => task.status === 'archived').length,
    };
  }, [tasks]);

  // Early return for initialization
  if (!isInitialized) {
    return null;
  }

  // Event handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && Array.isArray(tasks)) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsCreateModalOpen(true);
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'open' : 'completed';
    updateTaskStatus(task.id, newStatus);
  };

  return (
    <div className="container mx-auto py-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Taches
          </h1>
          <p className="text-gray-500">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center"
            variant='primary'
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
      </div>

      <Tabs defaultValue="tasks" className="w-full">

        <TabsContent value="tasks">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex gap-4">
              <Button
                key="all"
                variant={activeFilter === 'all' ? 'ghost-active' : 'ghost'}
                onClick={() => setActiveFilter('all')}
                className="flex items-center gap-2"
              >
                All
                <Badge variant="secondary" className="ml-1">
                  {tasks.length}
                </Badge>
              </Button>
              <Button
                key="open"
                variant={activeFilter === 'open' ? 'ghost-active' : 'ghost'}
                onClick={() => setActiveFilter('open')}
                className="flex items-center gap-2"
              >
                Open
                <Badge 
                  variant={activeFilter === 'open' ? 'secondary' : 'outline'}
                  className="ml-1"
                >
                  {tasksByStatus.open}
                </Badge>
              </Button>
              <Button
                key="closed"
                variant={activeFilter === 'closed' ? 'ghost-active' : 'ghost'}
                onClick={() => setActiveFilter('closed')}
                className="flex items-center gap-2"
              >
                Closed
                <Badge 
                  variant={activeFilter === 'closed' ? 'secondary' : 'outline'}
                  className="ml-1"
                >
                  {tasksByStatus.closed}
                </Badge>
              </Button>
              <Button
                key="archived"
                variant={activeFilter === 'archived' ? 'ghost-active' : 'ghost'}
                onClick={() => setActiveFilter('archived')}
                className="flex items-center gap-2"
              >
                Archived
                <Badge 
                  variant={activeFilter === 'archived' ? 'secondary' : 'outline'}
                  className="ml-1"
                >
                  {tasksByStatus.archived}
                </Badge>
              </Button>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <IconButton
                  variant="ghost"
                  onClick={() => setViewMode('list')}
                  active={viewMode === 'list'}
                  title="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </IconButton>
                <IconButton
                  variant="ghost"
                  onClick={() => setViewMode('grid')}
                  active={viewMode === 'grid'}
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </IconButton>
              </div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className={cn(
                "gap-4",
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2" 
                  : "flex flex-col"
              )}>
                {filteredTasks.map((task) => (
                  <SortableTask
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={(task) => handleToggleComplete(task)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {selectedTask && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer la tâche</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Êtes-vous sûr de vouloir supprimer la tâche &quot;{selectedTask.title}&quot; ?</p>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Supprimer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
