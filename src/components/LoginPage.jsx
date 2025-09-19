// src/components/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // 1. Importar Link
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    // ... (el resto de la función handleLogin se queda igual)
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Iniciar Sesión</h1>
        {error && <p className="error-message">{error}</p>}
        {/* ... (el resto del formulario se queda igual) ... */}
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Ingresar</button>

        {/* 2. Añadir este párrafo con el enlace */}
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;