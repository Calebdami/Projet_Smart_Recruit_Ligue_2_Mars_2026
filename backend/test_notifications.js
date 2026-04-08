import { NotificationService } from './src/services/notifications.js';
import { db } from './src/config/database.js';

// Test script pour vérifier les notifications toast
async function testNotifications() {
    try {
        console.log('🧪 Test des notifications toast...\n');

        // Simuler un utilisateur test
        const testUser = await db('users').first();
        if (!testUser) {
            console.log('❌ Aucun utilisateur trouvé en base');
            return;
        }

        console.log(`👤 Utilisateur test: ${testUser.first_name} ${testUser.last_name} (ID: ${testUser.id})`);

        // Test 1: Notification de succès
        console.log('\n📨 Test 1: Notification de succès');
        const successNotif = await NotificationService.create({
            userId: testUser.id,
            type: 'application_received',
            title: 'Nouvelle candidature reçue !',
            message: 'Une nouvelle candidature vient d\'arriver pour le poste de développeur.',
            priority: 'high',
            channel: 'in_app'
        });
        console.log('✅ Notification créée:', successNotif.id);

        // Test 2: Notification d'alerte sécurité
        console.log('\n🚨 Test 2: Alerte sécurité');
        const securityNotif = await NotificationService.create({
            userId: testUser.id,
            type: 'security_alert',
            title: 'Activité suspecte détectée',
            message: 'Connexion depuis un nouvel appareil.',
            priority: 'urgent',
            channel: 'in_app'
        });
        console.log('✅ Notification créée:', securityNotif.id);

        // Test 3: Notification d'information
        console.log('\nℹ️ Test 3: Notification d\'information');
        const infoNotif = await NotificationService.create({
            userId: testUser.id,
            type: 'application_status',
            title: 'Mise à jour de candidature',
            message: 'Votre candidature passe en phase d\'entretien.',
            priority: 'medium',
            channel: 'in_app'
        });
        console.log('✅ Notification créée:', infoNotif.id);

        console.log('\n🎉 Toutes les notifications ont été créées avec succès !');
        console.log('📱 Vérifiez votre frontend pour voir les toasts apparaître.');

    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    } finally {
        process.exit(0);
    }
}

testNotifications();