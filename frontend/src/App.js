import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUser from './pages/DashboardUser';
import DashboardComercial from './pages/DashboardComercial'; // Nuevo dashboard para Departamento Comercial
import DashboardGestion from './pages/DashboardGestion'; // Nuevo dashboard para Gestión y Tramitación
import DashboardPagos from './pages/DashboardPagos'; // Nuevo dashboard para Pagos y Recobros
import PrivateRoute from './components/PrivateRoute';  // Un componente para proteger rutas

// Componente para la ruta no autorizada
const Unauthorized = () => (
  <div>
    <h2>Acceso no autorizado</h2>
    <p>No tienes los permisos necesarios para acceder a esta página.</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Rutas protegidas con validación del rol */}
        <Route 
          path="/dashboard/comercial" 
          element={
            <PrivateRoute roles={['Departamento Comercial']}>
              <DashboardComercial />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/gestion" 
          element={
            <PrivateRoute roles={['Gestión y Tramitación de Documentación']}>
              <DashboardGestion />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/pagos" 
          element={
            <PrivateRoute roles={['Pagos y Recobros']}>
              <DashboardPagos />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <PrivateRoute roles={['Administrador']}>
              <DashboardAdmin />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/user" 
          element={
            <PrivateRoute roles={['Usuario']}>
              <DashboardUser />
            </PrivateRoute>
          } 
        />

        {/* Ruta para acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
