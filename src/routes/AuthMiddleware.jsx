import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MenuRoutes from "./MenuRoutes";

const findRouteRole = (routes, pathname, parentRole = undefined) => {
    for (const item of routes) {
        const currentRole = item.role ?? parentRole
        if (item.path === pathname) return currentRole
        if (item.sub) {
            const found = findRouteRole(item.sub, pathname, currentRole)
            if (found !== undefined) return found
        }
    }
    return undefined
}
const AuthMiddleware = ({ children }) => {
    const { loginStatus, user } = useAuth()
    const location = useLocation()

    if (!loginStatus) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        )
    }

    const requiredRole = findRouteRole(MenuRoutes, location.pathname)
    if (requiredRole && !requiredRole.includes(user?.role)) {
        return <Navigate to="/app001/dashboard" replace />
    }
    return children
}

export default AuthMiddleware