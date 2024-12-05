import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link aquí
import axios from 'axios';
import '../assets/styles/App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviamos la solicitud para el enlace de recuperación de contraseña
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(response.data.message); // Mensaje exitoso recibido del backend
    } catch (err) {
      setError('Hubo un problema enviando el enlace de recuperación.');
      console.error('Error en el proceso de recuperación:', err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Recupera tu contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Controlamos el valor del input
            required
          />
          <button className="form-button" type="submit">
            Enviar enlace de recuperación
          </button>
        </form>
        {message && <p className="form-success">{message}</p>} {/* Mensaje de éxito */}
        {error && <p className="form-error">{error}</p>} {/* Mensaje de error */}
        <div className="auth-links">
          <Link to="/login" className="auth-link">¿Recuperaste tu cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
