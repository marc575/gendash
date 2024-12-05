"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Task } from "@/types/Task";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Circle, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/Card";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

function TaskCard({ task, onToggle }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`group relative ${isDragging ? 'ring-2 ring-primary/20 shadow-lg' : ''}`}>
        <button
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground/50 hover:text-muted-foreground transition-all"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Card.Header>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggle(task.id)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
            >
              {task.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </p>
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{task.startTime}</span>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}

export function TaskGrid() {
  const { tasks, toggleTask, reorderTasks } = useDashboardStore();
  
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
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);
      
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={rectSortingStrategy}>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                variants={item}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TaskCard task={task} onToggle={toggleTask} />
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-8"
            >
              <p className="text-muted-foreground">Il n&apos;y a pas encore de tâches dans cette colonne</p>
              <button className="mt-4 text-sm text-primary hover:underline">
                Ajouter une tâche
              </button>
            </motion.div>
          )}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
