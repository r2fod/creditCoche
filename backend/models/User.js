const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Definimos el esquema del usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Usuario', 'Administrador', 'Departamento Comercial', 'Gestión y Tramitación de Documentación', 'Pagos y Recobros'],
    default: 'Usuario',
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.isPasswordMatch = async function (providedPassword) {
  return bcrypt.compare(providedPassword, this.password);
};

// Generar token de reset para la contraseña
userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expira en 10 minutos
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
