// middlewares/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

// Configuración del límite de solicitudes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos (el periodo en que se cuentan las solicitudes)
  max: 100, // Número máximo de solicitudes permitidas en el periodo de tiempo (15 minutos)
  message: "Demasiados intentos, por favor intente más tarde", // Mensaje que se envía cuando se excede el límite
  standardHeaders: true, // Incluir información sobre el límite en los encabezados de la respuesta (X-RateLimit-Remaining)
  legacyHeaders: false, // Desactivar los encabezados viejos de límite (X-RateLimit-Limit, X-RateLimit-Reset)
});

module.exports = limiter;
