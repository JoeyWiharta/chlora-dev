import { Navigate } from 'react-router-dom';
import MenuRoutes from './MenuRoutes';
import LoginForm from "../pages/Authentication/LoginForm";
import RegisterForm from "../pages/Authentication/RegisterForm";

const mappingMenuRoutes = (items) => items.flatMap(item => {
    if (item.sub) {
        return mappingMenuRoutes(item.sub)
    } else {
        return item.component ? [{
            path: item.path,
            component: item.component,
            role: item.role
        }] : []
    }
})

const authProtectedRoutes = [
    { path: "/", component: <Navigate to="/app001/dashboard" replace /> },
    ...mappingMenuRoutes(MenuRoutes)
];

const publicRoutes = [
    { path: "/login", component: <LoginForm /> },
    { path: "/register", component: <RegisterForm /> },
]

export { authProtectedRoutes, publicRoutes }