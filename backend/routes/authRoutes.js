// authRoutes.js
const express = require('express');
const { registerUser, loginUser, forgotPassword, verifyResetToken, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', registerUser);

// Ruta para login de usuarios
router.post('/login', loginUser);

// Ruta para solicitar el enlace de recuperación de contraseña (forgot-password)
router.post('/forgot-password', forgotPassword);

// Ruta para verificar el token de restablecimiento
router.get('/verify-reset-token/:token', verifyResetToken);

// Ruta para restablecer la contraseña
router.post('/reset-password', resetPassword); 

// Ruta protegida para acceder al dashboard, según el rol
router.get('/dashboard', authMiddleware, (req, res) => {
  const role = req.user?.role?.trim(); // Normalizamos el rol
  console.log('Rol recibido en authRoutes:', role);

  switch (role) {
    case 'Usuario':
    case 'Departamento Comercial':
    case 'Gestión y Tramitación de Documentación':
    case 'Pagos y Recobros':
    case 'Administrador':
      return res.status(200).json({ message: `Bienvenido al Dashboard de ${role}`, role });
    default:
      console.error('Rol no autorizado desde el servidor:', role);
      return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado' });
  }
});

module.exports = router;