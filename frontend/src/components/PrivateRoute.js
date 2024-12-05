import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';  // Usamos Redux para obtener el estado del usuario
import { useState, useEffect } from 'react';

const PrivateRoute = ({ roles }) => {
  const [loading, setLoading] = useState(true);  // Estado de carga para la verificación
  const user = useSelector(state => state.user);  // Obtenemos el usuario desde Redux

  useEffect(() => {
    if (user) {
      console.log('Usuario logueado:', user);  // Imprime el usuario en la consola
      setLoading(false);  // Ya tenemos al usuario, dejamos de cargar
    }
  }, [user]);

  // Si aún estamos cargando, mostramos un mensaje de espera
  if (loading) {
    return <div>Loading...</div>;  // Puedes mejorar este spinner con una animación o componente más atractivo
  }

  // Si no hay usuario, redirigimos a login
  if (!user) {
    console.log('Usuario no encontrado, redirigiendo a login');
    return <Navigate to="/login" />;
  }

  // Si el usuario no tiene el rol adecuado, lo redirigimos a una página no autorizada
  if (!roles.includes(user.role)) {
    console.log('Rol no autorizado, redirigiendo a "unauthorized"');
    return <Navigate to="/unauthorized" />;
  }

  // Si el usuario está autenticado y tiene el rol adecuado, se muestra el contenido
  console.log('Rol del usuario:', user.role);
  return <Outlet />;
};

export default PrivateRoute;
