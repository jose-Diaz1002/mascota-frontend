import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import AuthLayout from './AuthLayout';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        username: username,
        password: password,
      });

      // --- CORRECCIÓN ---
      // Si el registro es exitoso, solo guardamos el token.
      // No decodificamos nada aquí, ya que la respuesta de registro es simple.
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Asignamos el rol por defecto para cualquier nuevo usuario.
      localStorage.setItem('role', 'ROLE_USER');

      navigate('/dashboard');

    } catch (err) {
      console.error('Error en el registro:', err);
      if (err.response && err.response.status === 400) {
        setError('El nombre de usuario ya existe. Por favor, elige otro.');
      } else {
        setError('No se pudo completar el registro. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <AuthLayout>
      <form className="login-form" onSubmit={handleRegister}>
        <h1>Crear Cuenta</h1>
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

        <button type="submit" className="login-button">Registrarse</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;