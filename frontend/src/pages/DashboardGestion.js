import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardGestion = () => {
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores (si es necesario)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setError('No tienes acceso a esta página. Por favor, inicia sesión.');
      navigate('/login');  // Redirigir al login si no hay token
    } else {
      // Aquí podrías agregar lógica para validar el token con una API
      /*
      fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            setLoading(false); // Token válido, cargamos el dashboard
          } else {
            setLoading(false);
            setError('Token inválido. Por favor, inicia sesión nuevamente.');
            navigate('/login');
          }
        })
        .catch(error => {
          setLoading(false);
          setError('Hubo un error al verificar el token.');
          navigate('/login');
        });
      */

      setLoading(false); // Si no estamos haciendo una validación adicional, dejamos de cargar
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Mostrar un spinner o mensaje mientras validas el token
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <p>{error}</p>
      </div>
    );  // Mostrar mensaje de error si hay alguno
  }

  return (
    <div>
      <h1>Bienvenido al Dashboard de Gestión</h1>
      <p>Aquí podrás gestionar las configuraciones y opciones del sistema.</p>
      {/* Aquí puedes mostrar la información del usuario y las funcionalidades de gestión */}
    </div>
  );
};

export default DashboardGestion;
