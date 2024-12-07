"use client";

import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  ArrowUp,
  ArrowDown,
  Tag,
  Users,
  ListTodo,
  Target
} from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Task } from '@/types/Task';

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
  <Card className="p-6 hover:shadow-md transition-all duration-300">
    <div className={`p-3 rounded-full w-fit ${color} bg-opacity-10 mb-4`}>
      <Icon className={`h-6 w-6 ${color}`} />
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {trend && (
        <Badge 
          variant={trend.isPositive ? "secondary" : "outline"}
          className="flex items-center gap-1"
        >
          {trend.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {trend.value}%
        </Badge>
      )}
    </div>
  </Card>
);

const TaskProgressCard: React.FC<{
  title: string;
  total: number;
  completed: number;
  color: string;
}> = ({ title, total, completed, color }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <Card className="p-6">
      <h3 className="text-gray-500 text-sm font-medium mb-4">{title}</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">{completed}/{total}</span>
        <Badge variant="secondary" className={color}>
          {percentage}%
        </Badge>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-blue-400`}
        />
      </div>
    </Card>
  );
};

export default function DashboardPage() {
  const tasks = useTaskStore(state => state.tasks) || [];
  
  // Statistiques générales
  const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
  const completedTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => task.status === 'completed').length : 0;
  const openTasks = totalTasks - completedTasks;
  
  // Tâches par période
  const todayTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => 
    task.startTime && isToday(new Date(task.startTime)) && 
    task.status !== 'completed' && task.status !== 'archived'
  ).length : 0;
  
  const thisWeekTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => 
    task.startTime && isThisWeek(new Date(task.startTime)) && 
    task.status !== 'completed' && task.status !== 'archived'
  ).length : 0;
  
  const thisMonthTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => 
    task.startTime && isThisMonth(new Date(task.startTime)) && 
    task.status !== 'completed' && task.status !== 'archived'
  ).length : 0;
  
  // Tâches prioritaires
  const highPriorityTasks = Array.isArray(tasks) ? tasks.filter((task: Task) => 
    task.priority === 'High' && task.status !== 'completed' && task.status !== 'archived'
  ).length : 0;

  // Tâches récentes
  const recentTasks = Array.isArray(tasks) ? tasks
    .filter((task: Task) => task.status !== 'archived')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5) : [];

  // Calcul des tendances (exemple)
  const completionTrend = { value: 12, isPositive: true };
  const priorityTrend = { value: 5, isPositive: false };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Tableau de bord
          </h1>
          <p className="text-gray-500">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/last-activities'}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Activités
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/tasks'}
            className="flex items-center gap-2"
          >
            <ListTodo className="h-4 w-4" />
            Gérer les tâches
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={CheckCircle}
          title="Tâches complétées"
          value={completedTasks}
          trend={completionTrend}
          color="text-blue-600"
        />
        <StatCard
          icon={Clock}
          title="Tâches en cours"
          value={openTasks}
          color="text-purple-600"
        />
        <StatCard
          icon={AlertTriangle}
          title="Tâches prioritaires"
          value={highPriorityTasks}
          trend={priorityTrend}
          color="text-red-600"
        />
        <StatCard
          icon={Calendar}
          title="Tâches aujourd'hui"
          value={todayTasks}
          color="text-green-600"
        />
      </div>

      {/* Progression des tâches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskProgressCard
          title="Progression globale"
          total={totalTasks}
          completed={completedTasks}
          color="text-white bg-blue-600"
        />
        <TaskProgressCard
          title="Cette semaine"
          total={thisWeekTasks}
          completed={Array.isArray(tasks) ? tasks.filter((task: Task) => 
            task.startTime && isThisWeek(new Date(task.startTime)) && task.status === 'completed'
          ).length : 0}
          color="text-white"
        />
        <TaskProgressCard
          title="Ce mois"
          total={thisMonthTasks}
          completed={Array.isArray(tasks) ? tasks.filter((task: Task) => 
            task.startTime && isThisMonth(new Date(task.startTime)) && task.status === 'completed'
          ).length : 0}
          color="text-white"
        />
      </div>

      {/* Distribution et tâches récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-4">Distribution des priorités</h3>
          <div className="space-y-4">
            {[
              { label: 'Haute', value: highPriorityTasks, color: 'bg-red-600' },
              { label: 'Moyenne', value: Array.isArray(tasks) ? tasks.filter((task: Task) => task.priority === 'Medium').length : 0, color: 'bg-yellow-500' },
              { label: 'Basse', value: Array.isArray(tasks) ? tasks.filter((task: Task) => task.priority === 'Low').length : 0, color: 'bg-green-500' }
            ].map(priority => (
              <div key={priority.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{priority.label}</span>
                  <Badge variant="secondary">
                    {((priority.value / totalTasks) * 100).toFixed(1)}%
                  </Badge>
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
        </Card>

        {/* Tâches récentes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Tâches récentes</h3>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/tasks'}
              className="text-sm"
            >
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {recentTasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
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
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">{task.assignee.name}</span>
                    </Badge>
                  )}
                  {task.labels && task.labels.length > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs">{task.labels.length}</span>
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}