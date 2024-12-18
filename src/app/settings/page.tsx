"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Settings as SettingsIcon,
  Bell, 
  Palette, 
  Clock, 
  Globe, 
  Moon,
  Sun,
  Grid,
  List,
  Calendar as CalendarIcon,
  Save,
  RotateCcw,
  Check
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

interface SettingsSectionProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  icon: Icon,
  title,
  description,
  children
}) => (
  <Card className="p-6">
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-lg bg-blue-50">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mb-4">{description}</p>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  </Card>
);

const ViewOption: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}> = ({ icon: Icon, label, selected, onClick }) => (
  <Button
    variant={selected ? 'ghost-active' : 'ghost'}
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-2 py-6"
  >
    <Icon className="w-4 h-4" />
    {label}
  </Button>
);

export default function Settings() {
  const settings = useSettingsStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simuler une sauvegarde
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="container py-4 sm:py-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-blue-600" />
            Paramètres
          </h1>
          <p className="text-gray-500">
            Personnalisez votre expérience
          </p>
        </div>
        {saved && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1 self-start sm:self-center">
            <Check className="w-3 h-3" />
            Modifications enregistrées
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {/* Apparence */}
        <SettingsSection
          icon={Palette}
          title="Apparence"
          description="Personnalisez l&apos;apparence de l&apos;application"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-gray-500">Activer le mode sombre pour l&apos;interface</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-gray-500" />
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={settings.toggleDarkMode}
                />
                <Moon className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-medium">Vue par défaut</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <ViewOption
                  icon={List}
                  label="Liste"
                  value="list"
                  selected={settings.defaultView === 'list'}
                  onClick={() => settings.setDefaultView('list')}
                />
                <ViewOption
                  icon={Grid}
                  label="Grille"
                  value="grid"
                  selected={settings.defaultView === 'grid'}
                  onClick={() => settings.setDefaultView('grid')}
                />
                <ViewOption
                  icon={CalendarIcon}
                  label="Calendrier"
                  value="calendar"
                  selected={settings.defaultView === 'calendar'}
                  onClick={() => settings.setDefaultView('calendar')}
                />
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Gérez vos préférences de notification"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">Notifications du navigateur</p>
                <p className="text-sm text-gray-500">Recevoir des notifications pour les tâches importantes</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={settings.toggleNotifications}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </SettingsSection>

        {/* Horaires de travail */}
        <SettingsSection
          icon={Clock}
          title="Horaires de travail"
          description="Définissez vos heures de travail habituelles"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Début de journée</label>
              <Input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => settings.setWorkingHours({
                  ...settings.workingHours,
                  start: e.target.value
                })}
                className="w-full"
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
                className="w-full"
              />
            </div>
          </div>
        </SettingsSection>

        {/* Langue */}
        <SettingsSection
          icon={Globe}
          title="Langue"
          description="Choisissez la langue de l&apos;interface"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant={settings.language === 'fr' ? 'default' : 'outline'}
              onClick={() => settings.setLanguage('fr')}
              className="w-full justify-start gap-2"
            >
              <span className="w-6 h-6 rounded-full overflow-hidden">🇫🇷</span>
              Français
            </Button>
            <Button
              variant={settings.language === 'en' ? 'default' : 'outline'}
              onClick={() => settings.setLanguage('en')}
              className="w-full justify-start gap-2"
            >
              <span className="w-6 h-6 rounded-full overflow-hidden">🇬🇧</span>
              English
            </Button>
          </div>
        </SettingsSection>

        {/* Boutons d&apos;action */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
          <Button 
            variant="ghost"
            onClick={() => settings.resetSettings()}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button 
            variant="primary"
            onClick={handleSave}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}