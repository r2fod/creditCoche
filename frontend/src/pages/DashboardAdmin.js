import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  // Funciones de acción
  const handleManageUsers = () => {
    navigate('/admin/users');  // Redirigir a la página de gestión de usuarios
  };

  const handleSettings = () => {
    navigate('/admin/settings');  // Redirigir a la página de configuración
  };

  return (
    <div className="dashboard-container">
      <h1>Panel de Administrador</h1>
      <p>Bienvenido a la zona exclusiva para administradores.</p>
      <p>Desde aquí, podrás gestionar todas las configuraciones del sistema, usuarios y más.</p>
      
      {/* Aquí podrías agregar enlaces o botones para las funcionalidades del admin */}
      <div className="admin-actions">
        <button
          className="admin-button"
          onClick={handleManageUsers}
          aria-label="Gestionar usuarios"
        >
          Gestionar Usuarios
        </button>
        <button
          className="admin-button"
          onClick={handleSettings}
          aria-label="Configuraciones"
        >
          Configuraciones
        </button>
      </div>
    </div>
  );
};

export default DashboardAdmin;
