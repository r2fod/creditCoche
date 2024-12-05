const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // Agregamos una librería para validar el email
require('dotenv').config(); // Cargar las variables de entorno
const nodemailer = require('nodemailer');

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validación del email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Verificamos si el usuario ya existe
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);  // Solo para depuración en desarrollo
    
    // Creamos un nuevo usuario
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Guardamos el usuario en la base de datos
    const savedUser = await newUser.save();

    // Generamos el token JWT
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respondemos con el mensaje de éxito y el token
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { name: savedUser.name, email: savedUser.email, role: savedUser.role } // Información adicional del usuario
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el servidor. Por favor, intente nuevamente más tarde.' });
  }
};


// Función para login de usuarios
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificamos si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Compara la contraseña proporcionada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password); // Corregir el orden de los parámetros
    console.log('Contraseña proporcionada:', password); // Para depurar
    console.log('Contraseña guardada en la base de datos:', user.password); // Para depurar
    console.log('¿Las contraseñas coinciden?', isMatch);  // Esto debería devolver "true" si las contraseñas coinciden
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generamos el token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login exitoso',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Función para gestionar la solicitud de recuperación de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validamos el formato del email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email inválido' });
    }

    // Verificamos si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'El usuario con ese correo no existe.' });
    }

    // Generamos un token de restablecimiento
    const resetToken = user.generateResetToken(); // Deberás tener este método en tu modelo User.js (ver más abajo)
    await user.save();

    // Configuración de nodemailer para enviar el enlace al correo
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Puedes usar otro servicio como SendGrid o Amazon SES
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`; // Aquí se generará el enlace de restablecimiento

    const mailOptions = {
      from: 'info@creditoportucoche.com', // Reemplaza con tu correo
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };

    // Enviamos el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Hubo un error enviando el correo.' });
      }
      res.status(200).json({ message: 'Enlace de recuperación enviado a tu correo.' });
    });
  } catch (error) {
    console.error('Error en el proceso de recuperación:', error);
    res.status(500).json({ message: 'Hubo un error en el servidor.' });
  }
};

// Función para restablecer la contraseña con el token
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Buscar al usuario con el token de restablecimiento
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Establecer la nueva contraseña y limpiar el token y la expiración
    user.password = await bcrypt.hash(newPassword, 10); // Encriptamos la nueva contraseña
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Guardar los cambios
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al restablecer la contraseña' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
