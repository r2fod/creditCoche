const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Ruta para registrar nuevos usuarios
router.post('/register', registerUser);

// Ruta para login de usuarios
router.post('/login', loginUser);

// Ruta protegida para acceder al dashboard, según el rol
router.get('/dashboard', authMiddleware, (req, res) => {
  const role = req.user.role; // Obtenemos el rol desde el token

  switch(role) {
    case 'Usuario':
      res.status(200).json({ message: 'Bienvenido al Dashboard de Usuario' });
      break;
    case 'Departamento Comercial':
      res.status(200).json({ message: 'Bienvenido al Dashboard de Departamento Comercial' });
      break;
    case 'Gestión y Tramitación de Documentación':
      res.status(200).json({ message: 'Bienvenido al Dashboard de Gestión y Tramitación de Documentación' });
      break;
    case 'Pagos y Recobros':
      res.status(200).json({ message: 'Bienvenido al Dashboard de Pagos y Recobros' });
      break;
    case 'Administrador':
      res.status(200).json({ message: 'Bienvenido al Dashboard de Administrador' });
      break;
    default:
      res.status(403).json({ message: 'Acceso denegado' });
  }
});

module.exports = router;
