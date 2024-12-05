import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/App.css';

const ResetPassword = () => {
  const { token } = useParams();  // Obtiene el token de la URL
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Token inválido.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(response.data.message); // Mensaje de éxito
      setError(null); // Limpiar cualquier error
    } catch (err) {
      setMessage(null); // Limpiar el mensaje de éxito
      setError('Hubo un error al restablecer la contraseña.');
      console.error('Error al restablecer la contraseña:', err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Restablece tu contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-input"
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className="form-input"
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="form-button" type="submit">
            Restablecer contraseña
          </button>
        </form>
        {message && <p className="form-success">{message}</p>} {/* Mensaje de éxito */}
        {error && <p className="form-error">{error}</p>} {/* Mensaje de error */}
      </div>
    </div>
  );
};

export default ResetPassword;
