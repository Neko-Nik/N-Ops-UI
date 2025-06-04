import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    // const isLoggedIn = document.cookie.includes("LOGGED_IN=true");
    const isLoggedIn = true;

    return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
