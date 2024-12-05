// components/PrivateRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';  // Si usas Redux para el estado

const PrivateRoute = ({ roles }) => {
    const user = useSelector(state => state.user);  // O usa cualquier otro método para obtener el usuario

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!roles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
