// pages/DashboardUser.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos si hay un token en el almacenamiento
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Si no hay token, redirigimos al login
    } else {
      // Aquí puedes agregar una validación adicional para verificar el token si es necesario
      // por ejemplo, hacer una solicitud a la API para verificar si el token es válido
    }
  }, [navigate]);

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      {/* Aquí puedes mostrar la información del usuario */}
    </div>
  );
};

export default DashboardUser;
