// middlewares/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo de 100 solicitudes
    message: "Demasiados intentos, por favor intente más tarde"
});

module.exports = limiter;
