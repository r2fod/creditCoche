const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Usuario', 'Administrador', 'Departamento Comercial', 'Gestión y Tramitación de Documentación', 'Pagos y Recobros', 'Administrador Total'], 
    default: 'Usuario' 
  },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();  // Solo encriptar si la contraseña ha sido modificada

  try {
    // Generar un salt explícitamente
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);  // Encriptar la contraseña
    next();
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    next(error);
  }
});

// Método para generar el token de restablecimiento de contraseña (si es necesario)
userSchema.methods.generateResetToken = function () {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  this.resetPasswordToken = token;
  this.resetPasswordExpire = Date.now() + 3600000; // 1 hora
  return token;
};

module.exports = mongoose.model('User', userSchema);
