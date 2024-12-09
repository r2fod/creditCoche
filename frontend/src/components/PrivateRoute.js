// PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Usamos Redux para obtener el estado del usuario
import { useEffect, useState } from 'react';

const PrivateRoute = ({ roles }) => {
  const [loading, setLoading] = useState(true); // Estado de carga para la verificación
  const user = useSelector(state => state.user?.user); // Obtenemos el usuario desde Redux

  useEffect(() => {
    console.log('Estado del usuario desde Redux:', user); // Log para verificar el usuario
    setLoading(false); // Indicamos que la verificación terminó
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Puedes personalizar este componente de carga
  }

  if (!user) {
    console.log('Usuario no encontrado, redirigiendo a login');
    return <Navigate to="/login" />; // Redirigimos al login si no hay usuario
  }

  // Normalizamos roles y los comparamos
  const normalizedRoles = roles.map(r => r.trim().toLowerCase());
  const normalizedUserRole = user.role.trim().toLowerCase();

  if (!normalizedRoles.includes(normalizedUserRole)) {
    console.error('Rol no autorizado:', user.role); // Log para roles no autorizados
  }


  console.log('Acceso autorizado para el rol:', user.role); // Log para roles autorizados
  return <Outlet />; // Permitimos el acceso si el rol está autorizado
};

export default PrivateRoute;