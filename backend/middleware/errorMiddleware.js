// middlewares/errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  // Establecer el código de estado de la respuesta, por defecto 500 si no se proporciona
  const statusCode = err.statusCode || 500;

  // Establecer el mensaje de error, por defecto un mensaje genérico si no se proporciona
  const message = err.message || 'Something went wrong';

  // Si el entorno es de desarrollo, incluir el stack de errores para depuración
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  // Enviar la respuesta con el código de estado y el mensaje
  res.status(statusCode).json({
    message,
    stack, // Solo en desarrollo
  });
};

module.exports = errorMiddleware;
