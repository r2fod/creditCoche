// pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';
import '../assets/styles/App.css';

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (formData) => {
    try {
      // Enviamos los datos del formulario de registro al backend
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registro exitoso:', response.data);

      // Redirigimos al login si el registro es exitoso
      navigate('/login');
    } catch (err) {
      setError('Error en el registro');
      console.error('Error en el registro:', err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Registro</h2>

        {/* Usamos AuthForm para el formulario de registro */}
        <AuthForm 
          type="register" 
          onSubmit={handleRegisterSubmit} 
        />

        {/* Mostramos el mensaje de error si existe */}
        <ErrorAlert message={error} />
      </div>
    </div>
  );
};

export default Register;
