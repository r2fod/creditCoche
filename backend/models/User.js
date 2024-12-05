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
}, { timestamps: true }); // Agregar timestamps (createdAt, updatedAt)

// Middleware para hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  // Solo ejecutamos el hash de la contraseña si es nueva o modificada
  if (!this.isModified('password')) return next();

  try {
    // Generamos el salt y luego hasheamos la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();  // Continuamos con el guardado del usuario
  } catch (error) {
    next(error);  // Si ocurre algún error, lo pasamos al siguiente middleware
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

// Agregar un método estático para obtener un usuario por correo electrónico
userSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};

module.exports = mongoose.model('User', userSchema);
