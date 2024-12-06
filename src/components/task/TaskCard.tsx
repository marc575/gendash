"use client";

import { Task } from '@/types/Task';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Clock, Calendar, Trash2, GripVertical, CheckCircle2, Pencil, } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { formatDate, formatTime } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
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
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Card className={`relative overflow-hidden ${
        isDragging 
          ? 'ring-2 ring-primary shadow-lg dark:bg-accent' 
          : 'hover:shadow-md dark:hover:bg-accent/50'
        } transition-all duration-200`}
      >
        {/* En-tête avec actions */}
        <Card.Header className="flex flex-row items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground rounded-lg hover:bg-accent cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onToggleComplete(task)}
              className={`flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full border-2 ${
                task.isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-muted-foreground/30 hover:border-muted-foreground/50'
              } transition-colors`}
            >
              {task.isCompleted && (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {task.priority}
            </Badge>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {task.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="flex items-center gap-2"
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(task)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card.Header>

        {/* Titre et description */}
        <Card.Content className="space-y-4">
          <div className="min-w-0">
            <h3 className={`font-bold text-base ${
              task.isCompleted ? 'line-through text-muted-foreground' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Date et participants */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatTime(task.startTime)}</span>
              <Calendar className="w-4 h-4 ml-2" />
              <span>{formatDate(task.endTime)}</span>
            </div>

            <div className="flex -space-x-2">
              {task.participants?.map((participant) => (
                <Avatar
                  key={participant.id}
                  className="w-8 h-8 border-2 border-background"
                >
                  <AvatarImage
                    src={participant.avatar}
                    alt={participant.name}
                  />
                  <AvatarFallback>
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.assignee && !task.participants?.find(p => p.id === task.assignee?.id) && (
                <Avatar
                  className="w-8 h-8 border-2 border-background"
                >
                  <AvatarImage
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                  />
                  <AvatarFallback>
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
}