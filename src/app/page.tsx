"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { useDashboardStore } from "@/store/dashboardStore";
import { motion } from "framer-motion";
import { TaskList } from "@/components/task/TaskList";
import { TaskGrid } from "@/components/task/TaskGrid";
import { 
  Calendar,
  BarChart2, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Activity, 
  Filter, 
  LayersIcon, 
  MessageSquare, 
  LayoutGrid, 
  List,
  Star,
  Rocket,
  Target,
  TrendingUp
} from "lucide-react";
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
      <div className="py-8">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* En-tête avec profil et date */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">Bonjour, Marc 👋</h1>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2">
                <Target className="w-4 h-4" />
                Objectifs
              </Button>
              <Button variant="primary" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </Button>
            </div>
          </motion.div>

          {/* Cartes d'aperçu */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <Card.Title className="text-lg">Tâches en cours</Card.Title>
                </div>
                <div className="mt-2 space-y-1">
                  <Card.Description className="text-2xl font-bold">12</Card.Description>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    +2 depuis hier
                  </p>
                </div>
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
                <div className="mt-2 space-y-1">
                  <Card.Description className="text-2xl font-bold">85%</Card.Description>
                  <div className="w-full bg-blue-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </Card.Header>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                  <Card.Title className="text-lg">Complétées</Card.Title>
                </div>
                <div className="mt-2 space-y-1">
                  <Card.Description className="text-2xl font-bold">45</Card.Description>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                </div>
              </Card.Header>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <Card.Header>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Rocket className="h-4 w-4 text-purple-500" />
                  </div>
                  <Card.Title className="text-lg">Objectifs</Card.Title>
                </div>
                <div className="mt-2 space-y-1">
                  <Card.Description className="text-2xl font-bold">3/5</Card.Description>
                  <p className="text-sm text-muted-foreground">En bonne voie</p>
                </div>
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
                      &quot;La productivité n&apos;est pas un accident. C&apos;est toujours le résultat d&apos;un engagement envers l&apos;excellence, une planification intelligente et un effort ciblé.&quot;
                    </Card.Description>
                    <p className="text-sm text-muted-foreground mt-2">- Paul J. Meyer</p>
                  </div>
                </div>
              </Card.Header>
            </Card>
          </motion.div>

          {/* Section tâches et activités */}
          <motion.div variants={item} className="grid md:grid-cols-5 grid-cols-1 gap-6">
            {/* Section tâches */}
            <Card className="md:col-span-3 bg-card">
              <Card.Header className="pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Card.Title className="text-xl">Tâches du jour</Card.Title>
                      <Card.Description>Gérez vos priorités quotidiennes</Card.Description>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filtrer
                    </Button>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                          <LayoutGrid className="h-4 w-4" />
                        </Button>
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
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">En retard</p>
                    <p className="text-2xl font-semibold text-red-500">2</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Pour aujourd'hui</p>
                    <p className="text-2xl font-semibold text-primary">8</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Cette semaine</p>
                    <p className="text-2xl font-semibold">15</p>
                  </div>
                </div>
              </Card.Header>

              <Card.Content className="pt-6">
                <div className="">
                  {viewMode === 'list' ? <TaskList /> : <TaskGrid />}
                </div>
              </Card.Content>
            </Card>

            {/* Section activités */}
            <Card className="md:col-span-2 bg-card">
              <Card.Header className="pb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Card.Title className="text-xl">Activités récentes</Card.Title>
                      <Card.Description>Suivi des actions effectuées</Card.Description>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtrer
                      </Button>
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
                </div>

                {/* Stats rapides */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                    <p className="text-2xl font-semibold">12</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Cette semaine</p>
                    <p className="text-2xl font-semibold">47</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Ce mois</p>
                    <p className="text-2xl font-semibold">183</p>
                  </div>
                </div>
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
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-200"
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
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {activity.time}
                        </Badge>
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
