import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';
import { jwtDecode } from 'jwt-decode'; // Correcto: importación de jwt-decode
import '../assets/styles/App.css';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para verificar la expiración del token
  const isTokenExpired = (token) => {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000; // Expiración en milisegundos
    return Date.now() > expirationTime;
  };

  const handleLoginSubmit = async (formData) => {
    try {
      // Hacemos la solicitud de login al backend
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      
      // Almacenamos el token en el localStorage
      localStorage.setItem('token', token);

      // Verificamos si el token está expirado
      if (isTokenExpired(token)) {
        setError('El token ha expirado, por favor inicia sesión nuevamente.');
        return;
      }

      // Decodificamos el token para obtener el rol
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;
      
      // Depuración: Verifica el contenido del token
      console.log("Token decodificado:", decodedToken);

      // Redirigimos según el rol
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
      setError('Credenciales inválidas');
      console.error('Error en el login:', err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Iniciar sesión</h2>

        {/* Componente AuthForm para el formulario de login */}
        <AuthForm type="login" onSubmit={handleLoginSubmit} />

        {/* Mostrar errores si existen */}
        <ErrorAlert message={error} />
      </div>
    </div>
  );
};

export default Login;
