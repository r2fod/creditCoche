import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';
import { jwtDecode } from 'jwt-decode'; 
import '../assets/styles/App.css';

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData) => {
    setLoading(true); // Mostrar spinner de carga
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

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
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Iniciar sesión</h2>
        <AuthForm type="login" onSubmit={handleLoginSubmit} />
        {error && <ErrorAlert message={error} />}
        {loading ? <div className="spinner">Cargando...</div> : null}
      </div>
    </div>
  );
};

export default Login;
