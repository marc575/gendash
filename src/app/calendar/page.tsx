"use client";

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types/Task';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User, Tag, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CreateTaskModal } from '@/components/task/CreateTaskModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

const priorityColors = {
  Low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  Medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  High: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
};

const Calendar = () => {
  const { tasks, deleteTask } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthTasks, setMonthTasks] = useState<{ [key: string]: Task[] }>({});
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Générer les jours du mois avec les semaines complètes
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  useEffect(() => {
    const tasksByDay = tasks.reduce((acc: { [key: string]: Task[] }, task) => {
      if (!task.startTime) return acc;
      const dateKey = format(new Date(task.startTime), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
    }, {});
    setMonthTasks(tasksByDay);
  }, [tasks, currentDate]);

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day: Date, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedDay(isSameDay(selectedDay || new Date(), day) ? null : day);
  };

  const handleViewTask = (task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = () => {
    setIsEditMode(true);
    setIsViewModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleAsyncAction = (callback: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    callback();
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setIsViewModalOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h1>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousMonth}
              className="hover:bg-white rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="hover:bg-white rounded-md px-3"
            >
              Aujourd&#39;hui
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextMonth}
              className="hover:bg-white rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden shadow-sm">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="text-center py-2 bg-gray-50 font-medium text-gray-500">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayTasks = monthTasks[dateKey] || [];
          const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
          
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={(e) => handleDayClick(day, e)}
              className={`
                relative p-2 bg-white cursor-pointer transition-all
                min-h-[120px] border-b border-r border-gray-100
                hover:bg-gray-50
                ${isToday(day) ? 'bg-primary-50' : ''}
                ${!isSameMonth(day, currentDate) ? 'bg-gray-50' : ''}
                ${isSelected ? 'ring-2 ring-primary-500 ring-inset' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center
                  ${isToday(day) ? 'bg-primary-500 text-white' : 
                    !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-700'}
                `}>
                  {format(day, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {dayTasks.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayTasks.slice(0, isSelected ? undefined : 3).map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => handleViewTask(task, e)}
                    className={`
                      group relative text-xs p-1.5 rounded-md border cursor-pointer
                      hover:ring-2 hover:ring-primary-500 hover:ring-opacity-50
                      ${priorityColors[task.priority].bg}
                      ${priorityColors[task.priority].text}
                      ${priorityColors[task.priority].border}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      <div className="flex-1 font-medium truncate">
                        {task.title}
                      </div>
                      {isSelected && task.startTime && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {format(new Date(task.startTime), 'HH:mm')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditMode(false);
        }}
        task={isEditMode && selectedTask ? selectedTask : undefined}
      />

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la tâche</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Titre</div>
                <div className="text-lg font-medium">{selectedTask.title}</div>
              </div>

              {selectedTask.description && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Description</div>
                  <div className="text-sm text-gray-700">{selectedTask.description}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Date et heure</div>
                {selectedTask && selectedTask.startTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {format(new Date(selectedTask.startTime), 'PPPp', { locale: fr })}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500">Priorité</div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${priorityColors[selectedTask.priority].bg} ${priorityColors[selectedTask.priority].text}`}>
                  {selectedTask.priority}
                </div>
              </div>

              {selectedTask.assignee && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Assigné à</div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    {selectedTask.assignee.name}
                  </div>
                </div>
              )}

              {selectedTask.labels && selectedTask.labels.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-500">Labels</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.labels.map(label => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleEditTask}
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleAsyncAction(handleDeleteTask)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
