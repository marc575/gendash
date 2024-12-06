"use client";

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Bell, Palette, Clock, Globe } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export default function Settings() {
  const settings = useSettingsStore();

  return (
    <div className="py-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-8">Paramètres</h1>

      <div className="space-y-8">
        {/* Apparence */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Apparence
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-gray-500">Activer le mode sombre pour l&apos;interface</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={settings.toggleDarkMode}
              />
            </div>
            <div>
              <p className="font-medium mb-2">Vue par défaut</p>
              <select
                className="w-full p-2 border rounded-md"
                value={settings.defaultView}
                onChange={(e) => settings.setDefaultView(e.target.value as 'list' | 'grid' | 'calendar')}
              >
                <option value="list">Liste</option>
                <option value="grid">Grille</option>
                <option value="calendar">Calendrier</option>
              </select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications du navigateur</p>
                <p className="text-sm text-gray-500">Recevoir des notifications pour les tâches importantes</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={settings.toggleNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications par email</p>
                <p className="text-sm text-gray-500">Recevoir des rappels par email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={settings.toggleEmailNotifications}
              />
            </div>
          </div>
        </section>

        {/* Horaires de travail */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Horaires de travail
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Début de journée</label>
              <Input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => settings.setWorkingHours({
                  ...settings.workingHours,
                  start: e.target.value
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin de journée</label>
              <Input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => settings.setWorkingHours({
                  ...settings.workingHours,
                  end: e.target.value
                })}
              />
            </div>
          </div>
        </section>

        {/* Langue */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Langue
          </h2>
          <select
            className="w-full p-2 border rounded-md"
            value={settings.language}
            onChange={(e) => settings.setLanguage(e.target.value as 'fr' | 'en')}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </section>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={settings.resetSettings}
          >
            Réinitialiser
          </Button>
          <Button>
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}