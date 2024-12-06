"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Task } from "@/types/Task";
import { TaskCard } from "./TaskCard";
import { TaskFilter } from "./TaskFilter";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";

export function TaskList() {
  const { 
    tasks, 
    taskFilter,
    reorderTasks, 
    updateTask, 
    deleteTask,
    setTaskFilter 
  } = useDashboardStore();

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'open') return !task.done && task.status !== 'archived';
    if (taskFilter === 'closed') return task.done || task.status === 'completed';
    if (taskFilter === 'archived') return task.status === 'archived';
    return task.status === taskFilter;
  });
  
  const handleToggleComplete = (task: Task) => {
    updateTask(task.id, { 
      done: !task.done,
    });
  };

  const handleEdit = (task: Task) => {
    // TODO: Ouvrir un modal d'édition
    console.log('Edit task:', task);
  };

  const handleDelete = (task: Task) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(task.id);
    }
  };

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
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);
      
      const newTasks = arrayMove([...filteredTasks], oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-4">
      <TaskFilter
        currentFilter={taskFilter}
        onFilterChange={setTaskFilter}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredTasks} strategy={verticalListSortingStrategy}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={item}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>
    </div>
  );
}