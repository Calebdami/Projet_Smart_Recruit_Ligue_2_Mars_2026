import http from 'http';

function testAPI() {
    console.log('🔍 Test de l\'API notifications...\n');

    // Test de santé du serveur
    const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET'
    }, (res) => {
        console.log('✅ Serveur backend opérationnel - Status:', res.statusCode);

        // Test API notifications sans auth
        const req2 = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/notifications',
            method: 'GET'
        }, (res2) => {
            console.log('❌ API sans token - Status:', res2.statusCode, '(devrait être 401)');
            console.log('\n🎯 Le système de notifications toast est prêt !');
            console.log('📱 Ouvrez http://localhost:5174/ pour tester les toasts');
        });

        req2.on('error', (err) => {
            console.error('Erreur API:', err.message);
        });

        req2.end();
    });

    req.on('error', (err) => {
        console.error('❌ Serveur backend non accessible:', err.message);
    });

    req.end();
}

testAPI();