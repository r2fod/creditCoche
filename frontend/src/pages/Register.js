import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import ErrorAlert from '../components/ErrorAlert';

const Register = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleRegisterSubmit = async (formData) => {
    // Validación básica antes de enviar los datos al backend
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true); // Iniciar estado de carga

    try {
      // Enviamos los datos del formulario de registro al backend
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log('Registro exitoso:', response.data);

      // Redirigimos al login si el registro es exitoso
      navigate('/login');
    } catch (err) {
      setError('Error en el registro. Por favor, inténtalo nuevamente.');
      console.error('Error en el registro:', err);
    } finally {
      setLoading(false); // Finalizar estado de carga
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

        {/* Mostrar mensaje de error si existe */}
        <ErrorAlert message={error} />

        {/* Mostrar spinner de carga si se está procesando */}
        {loading && <div className="spinner">Cargando...</div>}
      </div>
    </div>
  );
};

export default Register;
