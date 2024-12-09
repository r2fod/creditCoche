// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';
import { useDispatch } from 'react-redux'; // Importamos useDispatch
import { setUser } from '../features/userSlice'; // Importamos la acción de Redux
import jwtDecode from 'jwt-decode'; // Para decodificar el token

const Login = () => {
  const [error, setError] = useState(null); // Estado para errores
  const [loading, setLoading] = useState(false); // Estado para carga
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Hook de Redux para disparar acciones

  const handleLoginSubmit = async (formData) => {
    setLoading(true); // Mostrar spinner de carga
    setError(null); // Limpiar cualquier error previo

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data; // Obtenemos el token de la respuesta

      localStorage.setItem('token', token); // Guardamos el token en el localStorage

      const decodedToken = jwtDecode(token); // Decodificamos el token
      console.log('Decoded Token:', decodedToken); // Log para verificar el token decodificado

      // Normalizamos y actualizamos el estado de Redux con los datos del usuario
      dispatch(setUser({
        name: decodedToken.name?.trim(),
        email: decodedToken.email?.trim(),
        role: decodedToken.role?.trim(),
      }));

      // Redirigimos según el rol del usuario
      switch (decodedToken.role?.trim().toLowerCase()) {
        case 'administrador':
          navigate('/dashboard/admin');
          break;
        case 'departamento comercial':
          navigate('/dashboard/comercial');
          break;
        case 'gestión y tramitación de documentación':
          navigate('/dashboard/gestion');
          break;
        case 'pagos y recobros':
          navigate('/dashboard/pagos');
          break;
        case 'usuario':
          navigate('/dashboard/user');
          break;
        default:
          console.error('Rol desconocido:', decodedToken.role);
          setError('Rol no reconocido.');
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Credenciales inválidas. Por favor, revisa tu email y contraseña.');
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Iniciar sesión</h2>
        <AuthForm type="login" onSubmit={handleLoginSubmit} />
        {error && <ErrorAlert message={error} />} {/* Mostrar error si existe */}
        {loading && <div className="spinner">Cargando...</div>} {/* Mostrar spinner si está cargando */}
      </div>
    </div>
  );
};

export default Login;
