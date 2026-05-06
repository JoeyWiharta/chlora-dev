import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authProtectedRoutes, publicRoutes } from "./routes/Index";
import AuthLayout from "./layout/AuthLayout";
import NonAuthLayout from "./layout/NonAuthLayout";
import AuthMiddleware from "./routes/AuthMiddleware";
import PropTypes from 'prop-types';
import { useAuth } from "./context/AuthContext";

const App = (props) => {
  const { user } = useAuth()
  const userRole = user?.role ?? "USER"

  const filteredRoutes = authProtectedRoutes.filter(route =>
    !route.role || route.role.includes(userRole)
  )

  return (
    <Routes>
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout mode={props.mode} toggleTheme={props.toggleTheme}>
              {route.component}
            </NonAuthLayout>
          }
        />
      ))}

      {
        filteredRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthMiddleware>
                <AuthLayout>{route.component}</AuthLayout>
              </AuthMiddleware>
            }
          />
        ))
      }
    </Routes >
  );
};

App.propTypes = {
  mode: PropTypes.any,
  toggleTheme: PropTypes.any,
};



export default App;
