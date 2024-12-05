import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';  // Importamos useDispatch
import { setUser } from '../features/userSlice';  // Importamos la acción que va a actualizar el estado

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Inicializamos dispatch

  const handleLoginSubmit = async (formData) => {
    setLoading(true); // Mostrar spinner de carga
    setError(null);  // Limpiar cualquier error previo

    // Validación del formulario
    if (!formData.email || !formData.password) {
      setLoading(false);
      setError('Por favor, ingresa ambos campos (email y contraseña).');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token); // Guardamos el token

      const decodedToken = jwtDecode(token);  // Decodificamos el token
      console.log('Decoded Token:', decodedToken);  // Imprimir el token decodificado
      const userRole = decodedToken.role;    // Obtenemos el rol del usuario

      console.log('Rol del usuario:', userRole);  // Verifica que el rol esté correctamente extraído

      // Dispatch para almacenar el usuario en Redux
      dispatch(setUser({ 
        name: decodedToken.name,
        email: decodedToken.email,
        role: userRole
      }));

      // Redirigir según el rol del usuario
      if (userRole === 'Administrador') {
        navigate('/dashboard/admin');
      } else if (userRole === 'Departamento Comercial') {
        navigate('/dashboard/comercial');
      } else if (userRole === 'Gestión y Tramitación de Documentación') {
        navigate('/dashboard/gestion');
      } else if (userRole === 'Pagos y Recobros') {
        navigate('/dashboard/pagos');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError('Credenciales inválidas. Por favor, revisa tu email y contraseña.');
      console.error('Error en el proceso de login:', err);
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Iniciar sesión</h2>
        <AuthForm type="login" onSubmit={handleLoginSubmit} />
        
        {/* Mostrar mensaje de error si existe */}
        {error && <ErrorAlert message={error} />}
        
        {/* Mostrar spinner de carga */}
        {loading && <div className="spinner" aria-live="assertive">Cargando...</div>}
      </div>
    </div>
  );
};

export default Login;
