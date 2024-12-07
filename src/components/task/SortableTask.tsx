import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types/Task';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '@/components/ui/Avatar';
import { Check, Pencil, Trash2, GripVertical } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  viewMode: 'list' | 'grid';
}

export function SortableTask({ task, onEdit, onDelete, onToggleComplete, viewMode }: SortableTaskProps) {
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
        <div className={cn(
          "flex items-center justify-between",
          viewMode === 'list' ? "mb-3" : "mb-4"
        )}>
          <div className="flex items-center gap-4 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                task.status === 'completed'
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-300"
              )}
              onClick={() => onToggleComplete(task)}
            >
              {task.status === 'completed' && <Check className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-medium">{task.title}</h3>
              <p className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">{task.project}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleComplete(task)}
            >
              {task.status === 'completed' ? 'Reopen' : 'Complete'}
            </Button>
          </div>
        </div>

        {viewMode === 'list' && (
          <>
            {/* Ligne de séparation */}
            <div className="border-t border-gray-200 -mx-4"></div>

            {/* Deuxième ligne: projet, temps, avatars et actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{task.description}</span>
                <span className="text-sm text-gray-500">
                  {renderTimeRange() && (
                    <> • {renderTimeRange()}</>
                  )}
                </span>
              </div>
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8"
                    title="Edit task"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(task)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {viewMode === 'grid' && (
          <>
            {/* Informations du projet et date */}
            <div className="mt-4 flex items-center justify-between">
              <div className='flex-1'>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-500 ">
                  {task.description}
                </span>
              </div>
              {renderTimeRange() && (
                <div className="text-sm text-gray-500">
                  {renderTimeRange()}
                </div>
              )}
              </div>
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

            {/* Bas de carte avec avatars et actions */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8"
                  title="Edit task"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task)}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
