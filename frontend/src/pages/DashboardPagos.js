import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPagos = () => {
  const [loading, setLoading] = useState(true);  // Estado de carga
  const [error, setError] = useState(null);  // Estado para errores (si es necesario)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setError('No tienes acceso a esta página. Por favor, inicia sesión.');
      navigate('/login'); // Redirigir al login si no hay token
    } else {
      // Validación adicional para el token, si es necesario
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
            setLoading(false);  // Si el token es válido, dejamos de cargar
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

      setLoading(false); // Si no hay validación adicional, dejamos de cargar
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Mostrar un mensaje de carga mientras validas el token
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
      <h1>Bienvenido al Dashboard de Pagos</h1>
      <p>Aquí podrás gestionar las transacciones y pagos del sistema.</p>
      {/* Aquí puedes mostrar la información del usuario y las funcionalidades de pagos */}
    </div>
  );
};

export default DashboardPagos;
