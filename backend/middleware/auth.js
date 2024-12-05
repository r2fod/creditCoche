const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Verificamos si existe el token en el encabezado Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No autorizado: No se encontró el token' });
  }

  try {
    // Verificamos y decodificamos el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Almacenamos la información decodificada del usuario en la petición
    req.user = decoded;

    // Continuamos con el siguiente middleware o ruta
    next();
  } catch (error) {
    // Verificamos el tipo de error y retornamos el mensaje adecuado
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
