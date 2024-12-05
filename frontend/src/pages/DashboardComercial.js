import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardComercial = () => {
  const [loading, setLoading] = useState(true);  // Estado de carga para la validación del token
  const [error, setError] = useState(null); // Estado para mostrar errores si es necesario
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);  // Paramos de cargar si no hay token
      setError('No tienes acceso a esta página. Por favor, inicia sesión.');
      navigate('/login');  // Redirigir al login si no hay token
    } else {
      // Aquí validamos el token, si es necesario
      // Puede ser una solicitud al servidor para verificar que el token es válido y no ha expirado
      fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.isValid) {
            setLoading(false);  // Validación exitosa
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
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Mostrar un mensaje de carga o spinner mientras validas el token
  }

  if (error) {
    return <div role="alert">{error}</div>;  // Mostrar el error si existe
  }

  return (
    <div>
      <h1>Bienvenido al Dashboard Comercial</h1>
      {/* Aquí puedes mostrar la información específica para el usuario comercial */}
    </div>
  );
};

export default DashboardComercial;
