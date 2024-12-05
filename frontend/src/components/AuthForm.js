import React, { useState } from 'react';
import FormInput from './FormInput'; // Componente para los inputs y select
import ErrorAlert from './ErrorAlert'; // Componente para mostrar errores

const AuthForm = ({ type, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: '', // Campo para el rol
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para manejar el spinner

  // Configuración de campos de formulario según tipo (login o register)
  const formFields = [
    { name: 'email', type: 'email', placeholder: 'Correo electrónico' },
    { name: 'password', type: 'password', placeholder: 'Contraseña' },
  ];

  // Si es formulario de registro, añadir campos adicionales
  if (type === 'register') {
    formFields.push(
      { name: 'confirmPassword', type: 'password', placeholder: 'Confirmar Contraseña' },
      { name: 'name', type: 'text', placeholder: 'Nombre completo' },
      { name: 'role', type: 'select', options: ['Usuario', 'Administrador', 'Departamento Comercial', 'Gestión y Tramitación de Documentación', 'Pagos y Recobros'] }
    );
  }

  // Manejo del cambio de valores en los campos del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validar los datos del formulario antes de enviarlo
  const validateForm = () => {
    // Verificar si el correo tiene el formato correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('El correo electrónico no es válido');
      return false;
    }

    // Verificar si las contraseñas coinciden
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }

    // Verificar que la contraseña tenga al menos 8 caracteres, un número y un carácter especial
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (type === 'register' && !passwordRegex.test(formData.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.');
      return false;
    }

    setError(null); // Limpiar error si todo es válido
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Mostrar el spinner de carga
    try {
      await onSubmit(formData); // Enviar los datos al componente padre (Login o Register)
    } catch (err) {
      console.error("Error al enviar los datos:", err);
      setError('Error al enviar los datos. Por favor, intenta nuevamente.'); // Mensaje de error amigable
    } finally {
      setLoading(false); // Ocultar el spinner de carga
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-live="polite">
      {formFields.map((field) => (
        <FormInput
          key={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          required
          options={field.options || []}
        />
      ))}
      
      {/* Error Alert */}
      {error && <ErrorAlert message={error} />}

      {/* Spinner de carga */}
      {loading ? (
        <div className="spinner" role="status">
          <span className="sr-only">Cargando...</span> {/* Accesibilidad */}
        </div>
      ) : (
        <button className="form-button" type="submit">
          {type === 'register' ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      )}

      {type === 'login' && (
        <div className="auth-links">
          <a href="/forgot-password" className="forgot-password">¿Olvidaste tu contraseña?</a>
          <p className="form-footer">
            ¿No tienes cuenta? <a href="/register">Registrarse</a>
          </p>
        </div>
      )}

      {type === 'register' && (
        <div className="auth-links">
          <p className="form-footer">
            ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
          </p>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
