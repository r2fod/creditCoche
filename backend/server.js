const express = require('express');
const connectDB = require('./config/db'); 
require('dotenv').config(); 
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // La URL de tu frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());  // Este middleware es suficiente para parsear JSON

// Rutas
app.use('/api/auth', authRoutes);  // Asegúrate de usar el prefijo '/api/auth'

// Configuración del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
