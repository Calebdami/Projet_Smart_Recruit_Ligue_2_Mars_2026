# Guide de test — Backend Binôme B

## Prérequis

- Node.js installé (version 18+)
- PostgreSQL installé sur ta machine
- Postman ou Thunder Client (extension VS Code)

---

## Étape 1 : Configurer le .env

Dans le dossier `backend`, crée un fichier `.env` avec ce contenu :

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1

DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartrecruit_db
DB_USER=postgres
DB_PASSWORD=TON_MOT_DE_PASSE_POSTGRES

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=smartrecruit_secret_key_dev_123456
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
HELMET_ENABLED=true
```

> Remplace `TON_MOT_DE_PASSE_POSTGRES` par ton vrai mot de passe PostgreSQL.
> Si tu n'as pas de mot de passe, laisse `DB_PASSWORD=` vide.

---

## Étape 2 : Créer la base de données

Ouvre un terminal et tape :

```bash
psql -U postgres
```

Puis dans la console PostgreSQL :

```sql
CREATE DATABASE smartrecruit_db;
\q
```

---

## Étape 3 : Installer les dépendances

```bash
cd backend
npm install
```

---

## Étape 4 : Lancer les migrations

Cette commande crée toutes les tables dans la base :

```bash
npm run migrate
```

Tu dois voir quelque chose comme :
```
Batch 1 run: 8 migrations
```

---

## Étape 5 : Lancer le seed

Cette commande insère les données de test (recruteur + candidat + offre) :

```bash
npm run seed
```

Tu verras dans le terminal :
```
✅ Seed de test réussi !
----------------------------
Recruteur  → recruteur@test.com / Test1234!
Candidat   → candidat@test.com  / Test1234!
Job ID     → xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Candidat ID→ xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> Copie le `Job ID` et le `Candidat ID`, tu en auras besoin pour les tests.

---

## Étape 6 : Démarrer le serveur

```bash
npm run dev
```

Tu dois voir :
```
🚀 SmartRecruit API Server Started
🌐 Server running on: http://localhost:3000
```

> Si le serveur plante à cause de Redis, voir la section "Problèmes fréquents" en bas.

---

## Étape 7 : Obtenir un token JWT

Avant de tester tes routes, tu dois te connecter pour avoir un token.

### Se connecter en tant que candidat

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "candidat@test.com",
  "password": "Test1234!"
}
```

### Se connecter en tant que recruteur

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "recruteur@test.com",
  "password": "Test1234!"
}
```

La réponse contient un `access_token`. Copie-le, tu en as besoin pour les étapes suivantes.

---

## Étape 8 : Tester tes 3 routes

### Route 1 — Postuler à une offre
Utilise le token du **candidat**.

```
POST http://localhost:3000/api/v1/applications
Authorization: Bearer TON_TOKEN_CANDIDAT
Content-Type: application/json

{
  "job_id": "LE_JOB_ID_DU_SEED",
  "cover_letter": "Je suis très motivé pour ce poste."
}
```

Réponse attendue : `201 Created` avec la candidature créée.

---

### Route 2 — Changer le statut (Drag & Drop)
Utilise le token du **recruteur**.
Remplace `ID_CANDIDATURE` par le `id` retourné à l'étape précédente.

```
PATCH http://localhost:3000/api/v1/applications/ID_CANDIDATURE/status
Authorization: Bearer TON_TOKEN_RECRUTEUR
Content-Type: application/json

{
  "status": "interview"
}
```

Réponse attendue : `200 OK` avec le statut mis à jour.

Statuts valides : `new` `reviewing` `interview` `offer` `hired` `rejected`

---

### Route 3 — Voir le board d'une offre
Utilise le token du **recruteur**.

```
GET http://localhost:3000/api/v1/applications/job/LE_JOB_ID_DU_SEED
Authorization: Bearer TON_TOKEN_RECRUTEUR
```

Réponse attendue : `200 OK` avec les candidatures groupées par statut (format board Trello).

---

## Problèmes fréquents

### Le serveur plante à cause de Redis
Redis n'est pas installé sur ta machine. Commente temporairement ces lignes dans `src/index.js` :

```js
// await redisClient.connect();
```

Et dans `src/config/redis.js`, fais retourner `true` à `checkRedisHealth`.

### Erreur "relation does not exist"
Les migrations n'ont pas tourné. Relance :
```bash
npm run migrate
```

### Erreur "password authentication failed"
Le mot de passe dans ton `.env` est incorrect. Vérifie `DB_PASSWORD`.
