# Guide de test — Frontend Binôme B

## Prérequis

- Node.js installé (version 18+)
- Le backend qui tourne sur `http://localhost:3000`
- Un terminal dans le dossier `frontend/`

---

## Étape 1 : Initialiser le projet Vue

Le `package.json` n'existe pas encore. Lance cette commande dans le dossier `frontend` :

```bash
cd frontend
npm create vite@latest . -- --template vue
```

> Quand Vite demande si tu veux écraser les fichiers existants, réponds `y`.

---

## Étape 2 : Installer les dépendances

```bash
npm install
npm install pinia axios
```

---

## Étape 3 : Créer le fichier `.env`

Dans le dossier `frontend`, crée un fichier `.env` :

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Étape 4 : Configurer `main.js`

Remplace le contenu de `frontend/src/main.js` par :

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

---

## Étape 5 : Configurer `App.vue`

Remplace le contenu de `frontend/src/App.vue` par :

```vue
<template>
  <Pipeline />
</template>

<script setup>
import Pipeline from './views/core/Pipeline.vue'
</script>
```

---

## Étape 6 : Démarrer le frontend

```bash
npm run dev
```

Tu verras :
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Ouvre `http://localhost:5173` dans ton navigateur.

---

## Étape 7 : Stocker le token JWT dans le navigateur

Le board nécessite un token recruteur pour appeler l'API.

1. Ouvre les **DevTools** du navigateur (`F12`)
2. Va dans l'onglet **Console**
3. Colle cette commande en remplaçant par ton vrai token :

```js
localStorage.setItem('access_token', 'TON_TOKEN_RECRUTEUR_ICI')
```

Pour obtenir le token, utilise Postman :

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "recruteur@test.com",
  "password": "Test1234!"
}
```

Copie le `access_token` de la réponse et colle-le dans la commande ci-dessus.

---

## Étape 8 : Tester le board

1. Rafraîchis la page `http://localhost:5173`
2. Tu vois un formulaire qui demande un **Job ID**
3. Récupère le Job ID depuis le terminal du backend (affiché lors du seed) ou via Postman :

```
GET http://localhost:3000/api/v1/applications/job/TON_JOB_ID
Authorization: Bearer TON_TOKEN_RECRUTEUR
```

4. Colle le Job ID dans le formulaire et clique **Charger le pipeline**
5. Le board s'affiche avec les 6 colonnes

---

## Étape 9 : Tester le Drag & Drop

1. Dans Postman, postule d'abord avec le compte candidat pour avoir une carte :

```
POST http://localhost:3000/api/v1/applications
Authorization: Bearer TON_TOKEN_CANDIDAT
Content-Type: application/json

{
  "job_id": "TON_JOB_ID",
  "cover_letter": "Test candidature"
}
```

2. Rafraîchis le board (bouton **Actualiser**)
3. Tu vois la carte du candidat dans la colonne **Nouveau**
4. Glisse la carte vers la colonne **Entretien**
5. La carte se déplace immédiatement (optimistic update)
6. Vérifie dans Postman que le statut a bien changé en base :

```
GET http://localhost:3000/api/v1/applications/job/TON_JOB_ID
Authorization: Bearer TON_TOKEN_RECRUTEUR
```

---

## Problèmes fréquents

### Page blanche au démarrage
Vérifie la console du navigateur (`F12 → Console`). Si tu vois une erreur Pinia, vérifie que `main.js` contient bien `app.use(createPinia())`.

### Erreur CORS
Le backend bloque les requêtes du frontend. Vérifie dans `backend/.env` :
```env
CORS_ORIGIN=http://localhost:5173
```
Puis redémarre le backend.

### "401 Unauthorized" sur toutes les requêtes
Le token n'est pas dans le localStorage. Refais l'étape 7.

### Le board ne charge pas
Vérifie que le backend tourne bien sur `http://localhost:3000` et que le `.env` frontend contient :
```env
VITE_API_URL=http://localhost:3000/api/v1
```
