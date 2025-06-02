const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

  });
}

// Exportar instancia de Firestore
const db = admin.firestore();
module.exports = db;
