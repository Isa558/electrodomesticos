const express = require('express');
const router = express.Router();
const db = require('./firebase');

// Obtener producto por ID
router.get('/productos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('Productos').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// Obtener todos los productos
router.get('/productos', async (req, res) => {
  try {
    const snapshot = await db.collection('Productos').get();
    const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos desde Firestore:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
