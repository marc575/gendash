"use client";

import { Card } from "@/components/ui/Card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { useDashboardStore } from "@/store/dashboardStore";
import { motion } from "framer-motion";
import { TaskList } from "@/components/task/TaskList";
import { TaskGrid } from "@/components/task/TaskGrid";
import { Calendar, BarChart2, Clock, CheckCircle2, Plus, Activity, Filter, LayersIcon, MessageSquare, LayoutGrid, List } from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const { activities, activityFilter, setActivityFilter, viewMode, setViewMode } = useDashboardStore(); 
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', dateOptions);

  const filteredActivities = activityFilter === 'all'
    ? activities
    : activities.filter(activity => activity.type === activityFilter);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b to-background/80 pb-8">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* En-tête avec profil et date */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">Bonjour, Marc 👋</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </p>
            </div>
          </motion.div>

          {/* Cartes d'aperçu */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <Card.Title className="text-lg">Tâches en cours</Card.Title>
                </div>
                <Card.Description className="text-2xl font-bold mt-2">12</Card.Description>
              </Card.Header>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <BarChart2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <Card.Title className="text-lg">Productivité</Card.Title>
                </div>
                <Card.Description className="text-2xl font-bold mt-2">85%</Card.Description>
              </Card.Header>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  <Card.Title className="text-lg">Complétées</Card.Title>
                </div>
                <Card.Description className="text-2xl font-bold mt-2">45</Card.Description>
              </Card.Header>
            </Card>
          </motion.div>

          {/* Message du jour */}
          <motion.div variants={item}>
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-none">
              <Card.Header>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <Card.Title>Citation du jour</Card.Title>
                    <Card.Description className="text-lg mt-2 italic">
                      'La productivité n'est pas un accident. C'est toujours le résultat d'un engagement envers l'excellence, une planification intelligente et un effort ciblé.'
                    </Card.Description>
                  </div>
                </div>
              </Card.Header>
            </Card>
          </motion.div>

          {/* Section tâches */}
          <motion.div variants={item} className="grid md:grid-cols-5 gap-6">
            <Card className="md:col-span-3 bg-gradient-to-br from-background to-muted/20">
              <Card.Header className="flex flex-row items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <Card.Title>Tâches du jour</Card.Title>
                  </div>
                  <Card.Description>Glissez et déposez pour réorganiser vos priorités</Card.Description>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                      <LayoutGrid className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setViewMode('list')} className="gap-2">
                        <List className="h-4 w-4" />
                        <span>Vue liste</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewMode('grid')} className="gap-2">
                        <LayoutGrid className="h-4 w-4" />
                        <span>Vue grille</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card.Header>
              <Card.Content className="pt-6">
                {viewMode === 'list' ? <TaskList /> : <TaskGrid />}
              </Card.Content>
            </Card>

            {/* Section activités */}
            <Card className="md:col-span-2 bg-gradient-to-br from-background to-muted/20">
              <Card.Header className="flex flex-row items-center justify-between border-b pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <Card.Title>Activités récentes</Card.Title>
                  </div>
                  <Card.Description>Votre historique d'actions</Card.Description>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                    <Filter className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setActivityFilter('all')} className="gap-2">
                      <LayersIcon className="h-4 w-4" />
                      <span>Toutes les activités</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter('task_completed')} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Tâches terminées</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter('comment_added')} className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Commentaires</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter('task_created')} className="gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Tâches créées</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Card.Header>
              <Card.Content className="pt-6">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        variants={item}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/5 transition-all duration-200"
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'task_completed' ? 'bg-green-500/10' :
                          activity.type === 'comment_added' ? 'bg-blue-500/10' :
                          'bg-primary/10'
                        }`}>
                          {activity.type === 'task_completed' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : activity.type === 'comment_added' ? (
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Plus className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{activity.action}</p>
                          <p className="text-sm text-muted-foreground truncate">{activity.task}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground whitespace-nowrap px-2 py-1 bg-muted/50 rounded-md">
                            {activity.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredActivities.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-muted-foreground">Aucune activité pour ce filtre</p>
                    </motion.div>
                  )}
                </motion.div>
              </Card.Content>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
