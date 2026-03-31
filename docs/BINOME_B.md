# Binôme B — Core Workflow : Applications

## Ce que j'ai fait

J'ai codé les 3 fichiers qui constituent ta partie backend.

---

## 1. Migration — `004_create_applications_table.js`

C'est le fichier qui crée la table `applications` dans la base de données.

**Colonnes importantes :**

| Colonne | Type | Rôle |
|---|---|---|
| `id` | UUID | Identifiant unique de la candidature |
| `candidate_id` | UUID | Qui a postulé (lien vers `candidates`) |
| `job_id` | UUID | À quelle offre (lien vers `jobs`) |
| `recruiter_id` | UUID | Quel recruteur gère ce dossier |
| `status` | ENUM | Position dans le pipeline |
| `cover_letter` | TEXT | Lettre de motivation |
| `notes` | JSONB | Notes du recruteur (tableau) |
| `rejection_reason` | TEXT | Raison du rejet si applicable |

**Statuts possibles :** `new` → `reviewing` → `interview` → `offer` → `hired` ou `rejected`

**Contrainte importante :** Un candidat ne peut postuler qu'une seule fois à la même offre (`UNIQUE candidate_id + job_id`).

**Correction apportée :** Le fichier original utilisait `exports.up` (CommonJS). Je l'ai converti en `export const up` (ES Modules) pour être cohérent avec le reste du projet.

---

## 2. Controller — `controllers/applications.js`

Contient la logique métier des 3 routes.

### `apply()` — POST /api/v1/applications
- Vérifie que `job_id` est fourni
- Vérifie que l'offre existe dans la base
- Vérifie que le candidat n'a pas déjà postulé (évite les doublons)
- Crée la candidature avec le statut `new` par défaut
- Enregistre l'action dans l'audit trail

### `updateStatus()` — PATCH /api/v1/applications/:id/status
- C'est la route critique pour le Drag & Drop
- Vérifie que le statut envoyé est valide
- Vérifie que la candidature existe
- Met à jour le statut + enregistre le recruteur responsable
- Si statut = `rejected`, enregistre aussi la raison
- Enregistre l'ancien et le nouveau statut dans l'audit trail

### `getByJob()` — GET /api/v1/applications/job/:id
- Récupère toutes les candidatures d'une offre
- Fait une jointure avec `candidates` pour avoir le nom/email/téléphone
- Accepte un filtre optionnel `?status=interview`
- Retourne les candidatures **groupées par statut** (format prêt pour le board Trello)

**Exemple de réponse `getByJob` :**
```json
{
  "success": true,
  "data": {
    "job_id": "abc-123",
    "total": 5,
    "board": {
      "new": [...],
      "reviewing": [...],
      "interview": [...],
      "offer": [],
      "hired": [],
      "rejected": [...]
    }
  }
}
```

---

## 3. Routes — `routes/applications.js`

Définit les 3 endpoints et leurs protections.

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/v1/applications` | candidat |
| PATCH | `/api/v1/applications/:id/status` | recruteur, admin |
| GET | `/api/v1/applications/job/:id` | recruteur, admin |

Chaque route passe par `authenticate` (vérifie le JWT) puis `authorize` (vérifie le rôle).

---

## Comment tester avec Postman

### 1. Postuler à une offre
```
POST http://localhost:3000/api/v1/applications
Authorization: Bearer <token_candidat>
Content-Type: application/json

{
  "job_id": "uuid-de-loffre",
  "cover_letter": "Je suis motivé..."
}
```

### 2. Changer le statut (Drag & Drop)
```
PATCH http://localhost:3000/api/v1/applications/uuid-candidature/status
Authorization: Bearer <token_recruteur>
Content-Type: application/json

{
  "status": "interview"
}
```

### 3. Voir le board d'une offre
```
GET http://localhost:3000/api/v1/applications/job/uuid-de-loffre
Authorization: Bearer <token_recruteur>
```

---

## Dépendances à surveiller

- Le **binôme A (Identity)** doit livrer `auth.js` pour que les tokens fonctionnent. En attendant, tu peux commenter `authenticate` et `authorize` dans les routes pour tester.
- Ton **binôme (Core A)** doit créer des offres pour avoir des `job_id` valides. En attendant, insère un job manuellement en base.

---

## Commandes utiles

```bash
# Lancer les migrations
npm run migrate

# Démarrer le serveur
npm run dev
```
