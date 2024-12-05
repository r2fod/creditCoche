import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // Usamos jwtDecode correctamente

const PrivateRoute = ({ roles, component: Component }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decodificamos el token para obtener el rol y verificar si ha expirado
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  // Verificamos si el token ha expirado
  const isTokenExpired = (decoded) => {
    const expirationTime = decoded.exp * 1000; // Expiración en milisegundos
    return Date.now() > expirationTime;
  };

  // Si el token ha expirado, redirigimos al login
  if (isTokenExpired(decodedToken)) {
    return <Navigate to="/login" />;
  }

  // Si el rol del usuario no coincide con el rol requerido para la ruta, redirigimos
  if (!roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PrivateRoute;
