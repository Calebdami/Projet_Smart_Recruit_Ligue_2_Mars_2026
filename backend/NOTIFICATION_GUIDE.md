# 🎯 **Guide Complet des Notifications - SmartRecruit**

## ✅ **Toutes les actions avec notifications**

### **📄 Candidatures (Applications)**

#### **1. Nouvelle candidature**
- **Action** : Candidat postule à une offre
- **Route** : `POST /api/applications`
- **Notification recruteur** : ✅ "Nouvelle candidature reçue"
- **WebSocket** : ✅ Temps réel
- **Priorité** : High

#### **2. Changement de statut (Drag & Drop)**
- **Action** : Recruteur déplace une candidature
- **Route** : `PATCH /api/applications/:id/drag-drop`
- **Notification candidat** : ✅ Messages personnalisés par statut
- **WebSocket** : ✅ Temps réel
- **Priorité** : Medium/High selon statut

#### **3. Changement de statut groupé**
- **Action** : Recruteur déplace plusieurs candidatures
- **Route** : `PATCH /api/applications/bulk/drag-drop`
- **Notifications** : ✅ Individuelles pour chaque candidat
- **WebSocket** : ✅ Temps réel
- **Audit** : ✅ Complet

### **💼 Offres d'emploi (Jobs)**

#### **1. Création d'offre**
- **Action** : Recruteur crée une nouvelle offre
- **Route** : `POST /api/jobs`
- **Notification candidats** : ✅ "Nouvelle offre correspondant à votre profil"
- **Ciblage** : ✅ Basé sur les compétences
- **WebSocket** : ✅ Temps réel

#### **2. Consultation de profil**
- **Action** : Recruteur consulte un profil candidat
- **Route** : `GET /api/candidates/:id`
- **Notification candidat** : ✅ "Votre profil a été consulté"
- **WebSocket** : ✅ Temps réel

### **🎥 Webinars**

#### **1. Création de webinar**
- **Action** : Admin/Recruteur crée un webinar
- **Route** : `POST /api/webinars`
- **Notification utilisateurs** : ✅ "Nouveau webinar disponible"
- **Ciblage** : ✅ Candidats et recruteurs
- **WebSocket** : ✅ Temps réel

#### **2. Inscription au webinar**
- **Action** : Utilisateur s'inscrit à un webinar
- **Route** : `POST /api/webinars/register`
- **Notification participant** : ✅ "Inscription confirmée"
- **Notification hôte** : ✅ "Nouvelle inscription"
- **WebSocket** : ✅ Temps réel

### **🔐 Sécurité (Auth)**

#### **1. Connexion suspecte**
- **Action** : Connexion depuis nouvelle IP/appareil
- **Route** : `POST /api/auth/login`
- **Notification utilisateur** : ✅ "Activité suspecte détectée"
- **Priorité** : Urgent
- **WebSocket** : ✅ Temps réel

#### **2. Changement de mot de passe**
- **Action** : Utilisateur change son mot de passe
- **Route** : `POST /api/auth/reset-password`
- **Notification utilisateur** : ✅ "Votre mot de passe a été changé"
- **Priorité** : High
- **WebSocket** : ✅ Temps réel

## 🔔 **Types de notifications Toastification**

### **🎨 Mapping des types**
```javascript
{
  'application_received': 'success',    // ✅ Vert
  'application_status': 'info',       // ℹ️ Bleu
  'job_published': 'success',         // ✅ Vert
  'job_expired': 'warning',           // ⚠️ Orange
  'webinar_reminder': 'info',         // ℹ️ Bleu
  'webinar_started': 'info',          // ℹ️ Bleu
  'profile_viewed': 'info',           // ℹ️ Bleu
  'system_update': 'info',            // ℹ️ Bleu
  'security_alert': 'error',          // ❌ Rouge
  'deadline_reminder': 'warning',      // ⚠️ Orange
  'new_message': 'info',              // ℹ️ Bleu
  'task_assigned': 'success',          // ✅ Vert
  'achievement': 'success'             // ✅ Vert
}
```

### **⚡ Configuration Toastification**
```javascript
{
  position: 'top-right',
  autoClose: 3000, // 5000ms pour urgent
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light'
}
```

## 🌐 **WebSocket - Messages temps réel**

### **📨 Format des messages**
```javascript
{
  "type": "toast_notification",
  "data": {
    "id": "notif-uuid",
    "title": "Nouvelle candidature reçue",
    "message": "John Doe a postulé à votre offre",
    "type": "success",
    "priority": "high",
    "createdAt": "2026-04-08T15:30:00Z",
    "data": {
      "applicationId": "app-uuid",
      "jobId": "job-uuid",
      "candidateId": "cand-uuid"
    },
    "toast": {
      "position": "top-right",
      "autoClose": 3000,
      "hideProgressBar": false,
      "closeOnClick": true,
      "pauseOnHover": true,
      "draggable": true,
      "theme": "light"
    }
  }
}
```

### **🔌 Connexion WebSocket**
```javascript
const ws = new WebSocket('ws://localhost:3000/ws?token=JWT_TOKEN');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'toast_notification') {
    // Afficher avec toastification
    toast(data.data.message, {
      type: data.data.type,
      position: data.data.toast.position,
      autoClose: data.data.toast.autoClose
    });
  }
};
```

## 📊 **API Rest - Endpoints**

### **🔔 Notifications**
```bash
GET    /api/notifications              # Liste avec pagination
GET    /api/notifications/unread-count # Compteur non lus
PATCH  /api/notifications/:id/read    # Marquer comme lu
POST   /api/notifications/mark-all-read # Tout marquer lu
DELETE /api/notifications/:id        # Supprimer
PUT    /api/notifications/preferences # Préférences
```

### **📄 Applications (Drag & Drop)**
```bash
PATCH  /api/applications/:id/drag-drop     # Individuel
PATCH  /api/applications/bulk/drag-drop   # Groupé
```

## 🧪 **Tests Complets**

### **📋 Scénario 1 : Cycle complet candidature**
1. **Créer offre** → Notifie candidats qualifiés
2. **Candidat postule** → Notifie recruteur
3. **Drag vers "Interview"** → Notifie candidat
4. **WebSocket temps réel** → Notifications instantanées

### **📋 Scénario 2 : Webinar**
1. **Créer webinar** → Notifie tous les utilisateurs
2. **Utilisateur s'inscrit** → Notifie participant + hôte
3. **WebSocket temps réel** → Notifications instantanées

### **📋 Scénario 3 : Sécurité**
1. **Connexion suspecte** → Notification urgente
2. **Changement mot de passe** → Notification sécurité
3. **WebSocket temps réel** → Alertes instantanées

## 🎯 **Points clés**

✅ **Toutes les actions critiques notifiées**
✅ **WebSocket temps réel fonctionnel**
✅ **Toastification intégrée**
✅ **Audit trail complet**
✅ **Priorités adaptées**
✅ **Messages personnalisés**
✅ **Ciblage intelligent**

**Votre système de notifications est maintenant complet et prêt !** 🚀
