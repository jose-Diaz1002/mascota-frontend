// ARCHIVO: LoginPage.jsx
// PROPÓSITO: Página de inicio de sesión donde los usuarios ingresan sus credenciales
// Envía las credenciales al backend y guarda el token JWT si el login es exitoso

"use client"

import { useState } from "react"
import axios from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import "./LoginPage.css"
import AuthLayout from "./AuthLayout"

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()
    setError("")

    try {
      const response = await axios.post("/auth/login", {
        username: username,
        password: password,
      })

      // DECODIFICACIÓN DEL TOKEN JWT
      // El backend devuelve un token JWT que contiene información del usuario
      // jwt-decode es una librería que extrae esa información sin validar la firma
      const { jwtDecode } = await import("jwt-decode")
      const decodedToken = jwtDecode(response.data.token)

      // ALMACENAMIENTO LOCAL: Guarda el token y el rol en localStorage
      // localStorage persiste los datos incluso si cierras el navegador
      localStorage.setItem("token", response.data.token) // Token para autenticar futuras peticiones
      localStorage.setItem("role", decodedToken.role[0].authority) // Rol del usuario (USER, ADMIN, etc.)
      localStorage.setItem("username", username) // Guardamos el nombre de usuario

      // REDIRECCIÓN: Lleva al usuario al dashboard después del login exitoso
      navigate("/dashboard")
    } catch (err) {
      // MANEJO DE ERRORES: Si el login falla, muestra un mensaje al usuario
      console.error("Error en el login:", err)
      setError("Usuario o contraseña incorrectos.")
    }
  }

  return (
    // AuthLayout: Componente que proporciona el diseño dividido (formulario + imagen)
    <AuthLayout>
      {/* FORMULARIO: Captura las credenciales del usuario */}
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Iniciar Sesión</h1>

        {/* MENSAJE DE ERROR: Solo se muestra si hay un error */}
        {error && <p className="error-message">{error}</p>}

        {/* INPUT: Nombre de usuario */}
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Ingresa tu nombre de usuario" // Agregado placeholder para mayor claridad
            value={username} // El valor del input está controlado por el estado
            onChange={(e) => setUsername(e.target.value)} // Actualiza el estado cuando el usuario escribe
            required // HTML5 validation - campo obligatorio
          />
        </div>

        {/* INPUT: Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password" // type="password" oculta el texto
            id="password"
            placeholder="Ingresa tu contraseña" // Agregado placeholder para mayor claridad
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN: Envía el formulario */}
        <button type="submit" className="login-button">
          Ingresar
        </button>

        {/* ENLACE: Lleva a la página de registro */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
