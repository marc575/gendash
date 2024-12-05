"use client";

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Tag,
  Users
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { format, isToday, isThisWeek, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}> = ({ icon: Icon, title, value, trend, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div className={`p-3 rounded-full w-fit ${color} bg-opacity-10 mb-4`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {trend && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <span className="ml-1">{trend.value}%</span>
        </div>
      )}
    </div>
  </motion.div>
);

const TaskProgressCard: React.FC<{
  title: string;
  total: number;
  completed: number;
  color: string;
}> = ({ title, total, completed, color }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-gray-500 text-sm font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">{completed}/{total}</span>
        <span className={`text-sm font-medium ${color}`}>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { tasks } = useTaskStore();
  
  // Statistiques générales
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  
  // Tâches par période
  const todayTasks = tasks.filter(task => 
    task.startTime && isToday(new Date(task.startTime))
  ).length;
  
  const weekTasks = tasks.filter(task => 
    task.startTime && isThisWeek(new Date(task.startTime))
  ).length;

  // Tâches par priorité
  const highPriorityTasks = tasks.filter(task => task.priority === 'High').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'Medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'Low').length;

  // Tâches assignées
  const assignedTasks = tasks.filter(task => task.assignee).length;

  // Tâches complétées cette semaine
  const completedWeekTasks = tasks.filter(task => 
    task.startTime && 
    isThisWeek(new Date(task.startTime)) && 
    task.status === 'completed'
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Tableau de bord
          </h1>
          <p className="text-gray-500">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <Button
          onClick={() => window.location.href = '/tasks'}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Voir les rapports
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle}
          title="Tâches complétées"
          value={completedTasks}
          trend={{ value: 12, isPositive: true }}
          color="text-green-600"
        />
        <StatCard
          icon={Clock}
          title="Tâches en cours"
          value={totalTasks - completedTasks}
          color="text-blue-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Tâches à haute priorité"
          value={highPriorityTasks}
          trend={{ value: 5, isPositive: false }}
          color="text-red-600"
        />
        <StatCard
          icon={Calendar}
          title="Tâches aujourd'hui"
          value={todayTasks}
          color="text-purple-600"
        />
      </div>

      {/* Progression des tâches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <TaskProgressCard
          title="Progression globale"
          total={totalTasks}
          completed={completedTasks}
          color="text-blue-600"
        />
        <TaskProgressCard
          title="Tâches assignées"
          total={totalTasks}
          completed={assignedTasks}
          color="text-purple-600"
        />
        <TaskProgressCard
          title="Tâches de la semaine"
          total={weekTasks}
          completed={completedWeekTasks}
          color="text-green-600"
        />
      </div>

      {/* Distribution des priorités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-4">Distribution des priorités</h3>
          <div className="space-y-4">
            {[
              { label: 'Haute', value: highPriorityTasks, color: 'bg-red-600' },
              { label: 'Moyenne', value: mediumPriorityTasks, color: 'bg-yellow-500' },
              { label: 'Basse', value: lowPriorityTasks, color: 'bg-green-500' }
            ].map(priority => (
              <div key={priority.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{priority.label}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((priority.value / totalTasks) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(priority.value / totalTasks) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${priority.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tâches récentes */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Tâches récentes</h3>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/tasks'}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-2 h-2 rounded-full
                    ${task.priority === 'High' ? 'bg-red-500' :
                      task.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'}
                  `} />
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {task.assignee && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">{task.assignee.name}</span>
                    </div>
                  )}
                  {task.labels && task.labels.length > 0 && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs">{task.labels.length}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}