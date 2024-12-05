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
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify-reset-token/${token}`);
        if (response.status === 200) {
          setMessage(response.data.message);  // Mensaje de éxito si el token es válido
        }
      } catch (err) {
        setError('El token es inválido o ha expirado.');
        console.error('Error al verificar el token:', err);
      }
    };

    verifyToken();
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
      navigate('/login'); // Redirigir al login después de restablecer la contraseña
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
