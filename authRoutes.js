const express = require('express');
const router = express.Router();
const db = require('./firebase');


router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena, documento, telefono, direccion } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existe = await db.collection('Usuarios')
      .where('Correo', '==', correo)
      .limit(1)
      .get();

    if (!existe.empty) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
  nombre,
  correo,
  contrasena,
  documento,
  telefono,
  direccion,
  creado: new Date().toISOString()
};

    const ref = await db.collection('Usuarios').add(nuevoUsuario);
    res.status(201).json({ id: ref.id, ...nuevoUsuario });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const snapshot = await db.collection('Usuarios')
      .where('correo', '==', correo)
      .where('contrasena', '==', contrasena)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    res.json({ id: userDoc.id, ...userData });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
})

module.exports = router;
