require('dotenv').config(); // Cargar variables de entorno
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definido en las variables de entorno');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('Error al conectar a MongoDB:', err.message);
    process.exit(1); // Termina la aplicación si la conexión falla
  }
};

module.exports = connectDB;
