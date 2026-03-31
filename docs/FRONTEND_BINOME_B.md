# Frontend — Binôme B (Core Workflow)

## Fichiers créés

```
frontend/src/
├── services/
│   ├── api.js                        → Instance Axios (token JWT auto)
│   └── applications.service.js       → Appels API candidatures
├── stores/
│   └── applications.js               → Store Pinia (état du board)
├── components/core/
│   ├── ApplicationCard.vue           → Carte candidat draggable
│   └── ApplicationPipeline.vue       → Board Trello complet
└── views/core/
    └── Pipeline.vue                  → Page principale du pipeline
```

---

## Ce que fait chaque fichier

### `services/api.js`
Instance Axios configurée avec :
- L'URL de base du backend (`http://localhost:3000/api/v1`)
- Ajout automatique du token JWT dans chaque requête
- Redirection vers `/login` si le token expire (401)

### `services/applications.service.js`
3 méthodes qui correspondent exactement aux 3 routes backend :
- `apply(job_id, cover_letter)` → POST /applications
- `updateStatus(id, status)` → PATCH /applications/:id/status
- `getByJob(job_id)` → GET /applications/job/:id

### `stores/applications.js`
Store Pinia qui gère l'état du board :
- `board` : objet avec 6 colonnes (new, reviewing, interview, offer, hired, rejected)
- `fetchBoard(job_id)` : charge les candidatures depuis l'API
- `moveApplication(application, from, to)` : déplace une carte avec **optimistic update** (la carte bouge immédiatement, et si l'API échoue elle revient en place)

### `components/core/ApplicationCard.vue`
Carte d'un candidat avec :
- Nom, email, téléphone, date de candidature
- Draggable (HTML5 Drag & Drop natif)
- Passe les données de la candidature via `dataTransfer`

### `components/core/ApplicationPipeline.vue`
Le board Trello complet avec :
- 6 colonnes colorées (Nouveau / En revue / Entretien / Offre / Embauché / Rejeté)
- Drag & Drop entre colonnes
- Compteur de candidats par colonne
- Bouton Actualiser
- Affichage des erreurs

### `views/core/Pipeline.vue`
Page qui contient le pipeline :
- Formulaire pour entrer un Job ID
- Affiche le board une fois le Job ID saisi
- Bouton pour changer d'offre

---

## Comment ça marche (flux complet)

```
1. Recruteur ouvre Pipeline.vue
2. Entre le Job ID de l'offre
3. → fetchBoard() appelle GET /applications/job/:id
4. → Le board s'affiche avec les candidats dans leurs colonnes
5. Recruteur glisse une carte vers une autre colonne
6. → moveApplication() appelle PATCH /applications/:id/status
7. → Le statut est mis à jour en base
```

---

## Prérequis pour faire tourner le frontend

### 1. Avoir un `package.json` avec les dépendances

Le frontend utilise :
- Vue 3
- Pinia (store)
- Axios (requêtes HTTP)
- Vite (bundler)

Si le `package.json` n'existe pas encore, crée-le :

```bash
cd frontend
npm create vite@latest . -- --template vue
npm install pinia axios
```

### 2. Configurer l'URL de l'API

Crée un fichier `.env` dans le dossier `frontend` :

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Configurer Pinia dans `main.js`

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

### 4. Démarrer le frontend

```bash
cd frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## Tester le board

1. Démarre le backend (`npm run dev` dans `backend/`)
2. Démarre le frontend (`npm run dev` dans `frontend/`)
3. Connecte-toi en tant que recruteur via Postman pour récupérer un token
4. Stocke le token dans le localStorage du navigateur :
   ```js
   localStorage.setItem('access_token', 'TON_TOKEN_ICI')
   ```
5. Ouvre `http://localhost:5173` et navigue vers le pipeline
6. Entre le Job ID du seed et teste le Drag & Drop
