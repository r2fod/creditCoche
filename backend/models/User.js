const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Esquema del usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nombre del usuario, requerido
  email: { type: String, required: true, unique: true }, // Email único
  password: { type: String, required: true }, // Contraseña del usuario
  role: {
    type: String,
    enum: ['Usuario', 'Administrador', 'Departamento Comercial', 'Gestión y Tramitación de Documentación', 'Pagos y Recobros'],
    default: 'Usuario', // Rol por defecto
  },
  resetPasswordToken: { type: String }, // Token para restablecer contraseña
  resetPasswordExpire: { type: Date }, // Fecha de expiración del token
}, { timestamps: true }); // Agregamos timestamps (createdAt y updatedAt)

// Middleware para hashear la contraseña antes de guardarla en la base de datos
userSchema.pre('save', async function (next) {
  // Verificamos si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();

  try {
    console.log('Hasheando contraseña para usuario:', this.email);
    // Generamos el hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Si ocurre un error, lo pasamos al siguiente middleware
  }
});

// Método para comparar contraseñas
userSchema.methods.isPasswordMatch = async function (providedPassword) {
  // Compara la contraseña ingresada con la almacenada (hasheada)
  return bcrypt.compare(providedPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
