import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@/components/ui/Avatar';
import { Check, Pencil, Trash2, GripVertical, Clock } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  viewMode: 'list' | 'grid';
}

export function SortableTask({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  viewMode = 'list',
}: SortableTaskProps) {
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

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const renderTimeRange = () => {
    if (!task.startTime || !task.endTime) return null;
    return (
      <>
        {formatDate(task.startTime)}
        {' - '}
        {formatDate(task.endTime)}
      </>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg shadow-sm border select-none",
        isDragging && "opacity-50 shadow-lg",
        viewMode === 'grid' && "h-full"
      )}
    >
      <div className={cn(
        "p-4",
        viewMode === 'grid' && "h-full flex flex-col"
      )}>
        {/* Première ligne: titre, description et bouton de validation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="min-w-0">
              <h3 className={cn(
                "font-medium text-lg",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}>{task.title}</h3>
              <p className="text-sm text-muted-foreground">{task.project}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer",
                task.status === 'completed'
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-muted-foreground/30 hover:border-muted-foreground/50"
              )}
              onClick={() => onToggleComplete(task)}
            >
              {task.status === 'completed' && <Check className="w-4 h-4" />}
            </div>
            <Button
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onDelete(task)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'list' && (
          <>
            {/* Ligne de séparation */}
            <div className="border-t border-gray-200 -mx-4"></div>

            {/* Deuxième ligne: description */}
            <div className="mt-4">
              <p 
                className={cn(
                  "text-sm text-muted-foreground break-words min-w-0 cursor-pointer",
                  !isDescriptionExpanded && "line-clamp-2"
                )}
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {task.description}
              </p>
            </div>

            {/* Troisième ligne: date et avatars */}
            <div className="flex items-center justify-between mt-3">
              {renderTimeRange() && (
                <div className="text-sm text-muted-foreground/80 flex items-center gap-1">
                  {renderTimeRange()}
                </div>
              )}
              <div className="flex items-center gap-4">
                {task.participants && task.participants.length > 0 && (
                  <AvatarGroup max={3}>
                    {task.participants.map((participant, index) => (
                      <Avatar key={index}>
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                )}
              </div>
            </div>
          </>
        )}

        {viewMode === 'grid' && (
          <>
            {/* Informations du projet et date */}
            <div className="mt-4">
              <p 
                className={cn(
                  "text-sm text-muted-foreground break-words min-w-0 cursor-pointer",
                  !isDescriptionExpanded && "line-clamp-2"
                )}
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              >
                {task.description}
              </p>
            </div>

            {/* Date et avatars */}
            <div className="flex items-center justify-between mt-3">
              {renderTimeRange() && (
                <div className="text-sm text-muted-foreground/80 flex items-center gap-1">
                  {renderTimeRange()}
                </div>
              )}
              {task.participants && task.participants.length > 0 && (
                <AvatarGroup max={3}>
                  {task.participants.map((participant, index) => (
                    <Avatar key={index}>
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </AvatarGroup>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
