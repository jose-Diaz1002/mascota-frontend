// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import PetDashboard from './components/PetDashboard';
import RegisterPage from './components/RegisterPage';

// Una función simple para verificar si el usuario tiene un token
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Un componente para proteger las rutas
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* 2. Añadir la ruta */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <PetDashboard />
            </PrivateRoute>
          } 
        />
        {/* Redirige a /dashboard si el usuario ya está autenticado, si no a /login */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;