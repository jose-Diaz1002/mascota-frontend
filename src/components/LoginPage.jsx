// LoginPage.jsx

import React, { useState } from 'react';
import './LoginPage.css'; // Importamos nuestros estilos CSS

function LoginPage() {
    // Estados para guardar el valor de los inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Función que se ejecuta al enviar el formulario
    const handleLogin = (event) => {
        event.preventDefault(); // Evita que la página se recargue al hacer submit
        console.log('Intentando iniciar sesión con:');
        console.log('Usuario:', username);
        console.log('Contraseña:', password);
        // Próximo paso: Aquí haremos la llamada a la API
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Iniciar Sesión</h1>

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