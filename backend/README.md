# 🚀 SmartRecruit v2.0 - Backend API

**Écosystème de Recrutement Prédictif & Engagement Candidat**

## 📋 Description

SmartRecruit transforme la gestion classique des candidatures (ATS) en une plateforme d'**intelligence décisionnelle**. Le backend fournit une API RESTful robuste avec scoring IA, parsing automatique de CV, et gestion de webinaires interactifs.

## 🏗️ Architecture Technique

- **Runtime** : Node.js 18+ with TypeScript
- **Framework** : Express.js avec architecture modulaire
- **Base de données** : PostgreSQL + Redis (cache/rate-limiting)
- **Authentification** : JWT + 2FA (TOTP)
- **File Storage** : Local/S3 compatible
- **Queue System** : Bull Queue pour les tâches async
- **Documentation** : Swagger/OpenAPI 3.0

## 📁 Structure du Projet

```
src/
├── config/           # Configuration (DB, Redis, JWT, etc.)
├── controllers/      # Logique des contrôleurs API
├── middleware/        # Middleware (auth, validation, rate-limiting)
├── models/          # Modèles de données et schémas
├── services/        # Logique métier (scoring, parsing, etc.)
├── routes/          # Définition des routes API
├── utils/           # Utilitaires et helpers
├── types/           # Types TypeScript
├── jobs/            # Cron jobs et tâches planifiées
└── tests/           # Tests unitaires et intégration
```

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd smartrecruit-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations

# Créer la base de données
createdb smartrecruit_db

# Lancer les migrations
npm run migrate

# Insérer les données de test (optionnel)
npm run seed

# Démarrer le serveur de développement
npm run dev
```

### Production

```bash
# Build le projet
npm run build

# Démarrer en production
npm start
```

## 📚 Documentation API

Une fois le serveur démarré, accédez à :
- **Swagger UI** : `http://localhost:3000/api-docs`
- **API Base** : `http://localhost:3000/api/v1`

## 🔧 Configuration

### Variables d'Environnement Clés

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement (development/production) | development |
| `PORT` | Port du serveur | 3000 |
| `DB_HOST` | Hôte PostgreSQL | localhost |
| `REDIS_HOST` | Hôte Redis | localhost |
| `JWT_SECRET` | Secret JWT (changé en prod!) | - |
| `SMTP_USER` | Email pour notifications | - |

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

## 🛡️ Sécurité & RGPD

- **Authentification** : JWT avec refresh tokens
- **2FA** : Support TOTP (Google Authenticator)
- **Rate Limiting** : Protection contre les attaques
- **Validation** : Joi pour toutes les entrées
- **Audit Trail** : Traçabilité des actions
- **Droit à l'oubli** : Suppression complète des données

## 📊 Fonctionnalités Principales

### 🎯 Scoring IA
- Algorithmes de matching compétences/postes
- Score sur 100 avec pondération custom
- Analyse sémantique des CV

### 📄 Parsing CV
- Extraction automatique (PDF, DOCX)
- Reconnaissance de compétences
- Détection de doublons (hash sémantique)

### 🎥 Webinaires
- Création et gestion automatique
- Envoi de rappels par email
- Analytics de participation

### 🔔 Notifications
- Emails transactionnels
- Système de relances automatiques
- Templates personnalisables

## 🔄 Workflows

### Pipeline de Recrutement
1. **Candidature** → Parsing CV → Scoring IA
2. **Évaluation** → Filtres avancés → Shortlist
3. **Entretien** → Webinaires → Suivi
4. **Décision** → Audit Trail → Onboarding

## 📈 Monitoring & Logs

- **Winston** : Logs structurés
- **Health Checks** : Monitoring API/DB/Redis
- **Metrics** : Performance tracking
- **Error Tracking** : Sentry compatible

## 🤝 Contributing

1. Fork le projet
2. Créer une feature branch (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branch (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir le fichier [LICENSE](LICENSE) pour détails.

## 📞 Support

Pour toute question ou support technique :
- Email : support@smartrecruit.com
- Documentation : [Wiki du projet](https://github.com/smartrecruit/docs)
- Issues : [GitHub Issues](https://github.com/smartrecruit/backend/issues)
