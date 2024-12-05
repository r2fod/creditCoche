const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');

const app = express();

// Conectar a la base de datos
connectDB();

// Configurar el middleware de CORS
app.use(cors({
  origin: 'http://localhost:3000', // La URL de tu frontend (ajustar si el frontend está en otro puerto)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Asegúrate de permitir todos los métodos necesarios
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Configurar Express para usar JSON
app.use(express.json());

// Configurar Express para confiar en las cabeceras de los proxies (solo si es necesario)
app.set('trust proxy', 1); // Si la app está detrás de un proxy

// Rutas
app.use('/api/auth', authRoutes); // Asegúrate de usar el prefijo '/api/auth'

// Middleware de limitación de tasa
app.use(rateLimitMiddleware); // Aplica el rate limiting a todas las rutas

// Middleware de manejo de errores
app.use(errorMiddleware); // Agrega el middleware de errores al final

// Configuración del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
