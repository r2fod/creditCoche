const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Para generar el token de reset

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido.' });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const newUser = new User({ name, email, password, role });  // Sin hacer hash aquí
    const savedUser = await newUser.save();

    const token = jwt.sign({ userId: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      token,
      user: { name: savedUser.name, email: savedUser.email, role: savedUser.role },
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Hubo un error en el servidor. Por favor, intenta nuevamente más tarde.' });
  }
};

// Función para login de usuarios
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    // Comprobamos que la contraseña ingresada coincida con la almacenada
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    // Si la contraseña es correcta, generamos el token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login exitoso.',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor. Por favor, intenta nuevamente más tarde.' });
  }
};


// Función para recuperación de contraseña
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'El correo electrónico no es válido.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'El usuario con ese correo no existe.' });
    }

    // Generar un token de restablecimiento
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token válido por 10 minutos
    await user.save();

    // Enviar el correo de recuperación
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Enlace de recuperación enviado a tu correo.' });
    } catch (mailError) {
      console.log('Error al enviar el correo:', mailError);
      return res.status(500).json({ message: 'Hubo un error enviando el correo.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error en el proceso de recuperación.' });
  }
};

// Verificación de token de restablecimiento
const verifyResetToken = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    res.status(200).json({ message: 'Token válido.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar el token.' });
  }
};

// Restablecimiento de la contraseña
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al restablecer la contraseña.' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, verifyResetToken, resetPassword };
