const express = require('express');
const router = express.Router();
const db = require('./firebase');

// Ruta para registrar una compra
router.post('/transaccion', async (req, res) => {
  const { idUsuario, productoId, cantidad } = req.body;

  try {
    const productoRef = db.collection('Productos').doc(productoId);
    const productoSnap = await productoRef.get();

    if (!productoSnap.exists) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const producto = productoSnap.data();

    if (producto.Stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const total = producto.Precio * cantidad;

    await db.collection('transacciones').add({
      idUsuario,
      productoId,
      nombreProducto: producto.Nombre,
      precioUnitario: producto.Precio,
      cantidad,
      total,
      fecha: new Date().toISOString(),
      estado: 'pagado'
    });

    await productoRef.update({
      Stock: producto.Stock - cantidad
    });

    res.json({ mensaje: 'Compra registrada correctamente', total });
  } catch (error) {
    console.error(' Error en transacción:', error);
    res.status(500).json({ error: 'Error interno al registrar transacción' });
  }
});

// Obtener historial de compras por usuario
router.get('/transacciones/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const snapshot = await db.collection('transacciones')
      .where('idUsuario', '==', idUsuario)
      .orderBy('fecha', 'desc')
      .get();

    const compras = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});


module.exports = router;
