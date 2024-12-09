const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware de autenticación para verificar el token
const authMiddleware = (req, res, next) => {
  // Extraemos el token del encabezado Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, retornamos un error 401
  if (!token) {
    console.error('Token no encontrado');
    return res.status(401).json({ message: 'No autorizado: No se encontró el token' });
  }

  try {
    // Verificamos y decodificamos el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);

    // Guardamos los datos decodificados del usuario en req.user para futuras referencias
    req.user = decoded;

    // Continuamos con la siguiente función o ruta
    next();
  } catch (error) {
    // Manejo de errores relacionados con el token
    console.error('Error al verificar el token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado, por favor inicia sesión nuevamente' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido, por favor inicia sesión nuevamente' });
    } else {
      return res.status(500).json({ message: 'Error al verificar el token' });
    }
  }
};

module.exports = authMiddleware;
