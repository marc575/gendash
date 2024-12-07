# TaskMaster - Application de Gestion de Tâches

TaskMaster est une application moderne et intuitive de gestion de tâches, conçue pour offrir une expérience utilisateur fluide et professionnelle.

![TaskMaster Preview](public/preview.png)

## 🚀 Fonctionnalités

- **Tableau de Bord Personnalisé**
  - Vue d'ensemble des tâches
  - Statistiques en temps réel
  - Activités récentes

- **Gestion des Tâches**
  - Création et modification de tâches
  - Catégorisation et étiquetage
  - Suivi de l'avancement
  - Priorités et dates d'échéance

- **Messagerie Intégrée**
  - Conversations en temps réel
  - Liste des discussions
  - Notifications non lues
  - Interface intuitive

- **Interface Utilisateur**
  - Design moderne et épuré
  - Mode sombre/clair
  - Composants réutilisables
  - Animations fluides

## 🛠 Technologies Utilisées

- **Frontend**
  - React 18
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Framer Motion
  - Lucide Icons

- **État Global**
  - Zustand

- **Style**
  - Police Outfit (Google Fonts)
  - Système de design personnalisé
  - Variables CSS pour les thèmes

## 📦 Structure du Projet

```
src/
├── app/                    # Pages de l'application
│   ├── dashboard/         # Tableau de bord
│   ├── messages/         # Messagerie
│   ├── settings/        # Paramètres
│   └── tasks/          # Gestion des tâches
├── components/          # Composants réutilisables
│   ├── layout/         # Mise en page
│   ├── task/          # Composants liés aux tâches
│   ├── ui/           # Composants d'interface
│   └── message/     # Composants de messagerie
├── data/            # Données mockées
├── lib/            # Utilitaires et configurations
├── styles/        # Styles globaux
└── types/        # Types TypeScript
```

## 🎨 Système de Design

### Typographie
```typescript
fontSize: {
  xs: '0.8rem',    // Très petit texte
  sm: '1rem',      // Petit texte
  base: '1.1rem',  // Texte normal
  lg: '1.2rem',    // Grand texte
  xl: '1.4rem',    // Très grand texte
  '2xl': '1.6rem', // Titres
  // ...jusqu'à 9xl
}
```

### Couleurs
- Variables CSS personnalisées pour les thèmes
- Support du mode sombre
- Palette de couleurs cohérente

### Composants
- Boutons avec variantes
- Cartes et conteneurs
- Badges et étiquettes
- Champs de formulaire
- Avatars et icônes

## 🚀 Pour Commencer

1. **Installation**
   ```bash
   npm install
   ```

2. **Développement**
   ```bash
   npm run dev
   ```

3. **Production**
   ```bash
   npm run build
   npm start
   ```

## 📱 Responsive Design

L'application est entièrement responsive avec des points de rupture optimisés :
- Mobile : < 640px
- Tablette : 640px - 1024px
- Desktop : > 1024px

## 🔄 État Global

Gestion de l'état avec Zustand pour :
- Tâches et projets
- Préférences utilisateur
- État de la messagerie
- Thème de l'application

## 🔒 Sécurité

- Authentification sécurisée
- Protection des routes
- Validation des données
- Gestion des sessions

## 🎯 Roadmap

- [ ] Intégration backend
- [ ] Notifications en temps réel
- [ ] Collaboration en équipe
- [ ] Applications mobiles
- [ ] Intégrations tierces

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

---

Développé avec ❤️ par [Tatchou Marc]