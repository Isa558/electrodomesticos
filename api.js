const express = require('express');
const cors = require('cors');
const db = require('./firebase.js');
const transaccionRoutes = require('./transaccionRoutes');
const authRoutes = require('./authRoutes');
const productosRoutes = require('./productosRoutes');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());


app.use('/api', transaccionRoutes);
app.use('/api', authRoutes);
app.use('/api', productosRoutes);



app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});

