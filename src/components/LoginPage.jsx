// src/components/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios'; // 1. Importamos axios
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate(); // Hook para la navegación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 2. Un estado para guardar mensajes de error

  // Dentro de LoginPage.jsx, reemplaza tu función handleLogin por esta

const handleLogin = async (event) => {
  event.preventDefault();
  setError('');

  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      username: username,
      password: password,
    });

    const token = response.data.token;
    console.log('¡Login exitoso! Token:', token);

    // Guardamos el token en el almacenamiento local del navegador
    localStorage.setItem('token', token);

    // Navegamos al dashboard
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

        {/* 6. Mostramos el mensaje de error si existe */}
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;