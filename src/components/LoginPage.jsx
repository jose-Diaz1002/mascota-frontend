import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import AuthLayout from './AuthLayout'; // 1. Importamos el nuevo layout

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      // (Esta lógica para el login se queda exactamente igual)
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password,
      });

      // Decodificamos el token para obtener el rol y lo guardamos
      // (Asegúrate de tener jwt-decode instalado: npm install jwt-decode)
      const { jwtDecode } = await import('jwt-decode');
      const decodedToken = jwtDecode(response.data.token);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', decodedToken.role[0].authority);

      navigate('/dashboard');
    } catch (err) {
      console.error('Error en el login:', err);
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    // 2. Usamos AuthLayout para envolver el formulario
    <AuthLayout>
      {/* 3. Se elimina el <div className="login-container"> */}
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Iniciar Sesión</h1>
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        <button type="submit" className="login-button">Ingresar</button>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;