"use client";

import { Task } from "@/store/dashboardStore";
import { Clock, GripVertical, CheckCircle2, Circle } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
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
      className={`group flex items-center gap-4 p-3 bg-card hover:bg-accent/5 rounded-xl transition-all duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <button
        className="flex-shrink-0 p-1 rounded-lg hover:bg-accent/10 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-accent/10 transition-colors"
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

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
        <Clock className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{task.time}</span>
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path d="M3 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path d="M17 12a2 2 0 100-4 2 2 0 000 4z"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
