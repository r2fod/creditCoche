const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', registerUser);

// Ruta para login de usuarios
router.post('/login', loginUser);

// Ruta para solicitar el enlace de recuperación de contraseña (forgot-password)
router.post('/forgot-password', forgotPassword);

// Ruta para restablecer la contraseña
router.post('/reset-password', authMiddleware, resetPassword); // La ruta está protegida por el middleware de autenticación


// Ruta protegida para acceder al dashboard, según el rol
router.get('/dashboard', authMiddleware, (req, res) => {
  const role = req.user.role; // Obtenemos el rol desde el token

  // Usamos un switch para manejar los roles y redirigir al dashboard correspondiente
  switch(role) {
    case 'Usuario':
      return res.status(200).json({ message: 'Bienvenido al Dashboard de Usuario', role });
    case 'Departamento Comercial':
      return res.status(200).json({ message: 'Bienvenido al Dashboard de Departamento Comercial', role });
    case 'Gestión y Tramitación de Documentación':
      return res.status(200).json({ message: 'Bienvenido al Dashboard de Gestión y Tramitación de Documentación', role });
    case 'Pagos y Recobros':
      return res.status(200).json({ message: 'Bienvenido al Dashboard de Pagos y Recobros', role });
    case 'Administrador':
      return res.status(200).json({ message: 'Bienvenido al Dashboard de Administrador', role });
    default:
      return res.status(403).json({ message: 'Acceso denegado' });
  }
});

module.exports = router;
