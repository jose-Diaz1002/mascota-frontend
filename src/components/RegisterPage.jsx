// ARCHIVO: RegisterPage.jsx
// PROPÓSITO: Página de registro donde nuevos usuarios crean su cuenta
// Envía los datos al backend y si es exitoso, guarda el token y redirige al dashboard

"use client"

import { useState } from "react"
import axios from "axios" // Librería para hacer peticiones HTTP al backend
import { useNavigate, Link } from "react-router-dom" // useNavigate para redirigir, Link para enlaces
import "./LoginPage.css" // Reutiliza los estilos de LoginPage
import AuthLayout from "./AuthLayout" // Layout con diseño dividido (formulario + imagen)

function RegisterPage() {
  // ESTADOS: Almacenan los valores de los inputs y mensajes de error
  const [username, setUsername] = useState("") // Guarda el nombre de usuario
  const [password, setPassword] = useState("") // Guarda la contraseña
  const [error, setError] = useState("") // Guarda mensajes de error
  const navigate = useNavigate() // Hook para redirigir a otras páginas

  // FUNCIÓN: handleRegister
  // PROPÓSITO: Se ejecuta cuando el usuario envía el formulario de registro
  // 1. Valida que la contraseña tenga al menos 6 caracteres
  // 2. Envía los datos al backend
  // 3. Si es exitoso: guarda token y redirige a /dashboard
  // 4. Si falla: muestra mensaje de error apropiado
  const handleRegister = async (event) => {
    event.preventDefault() // Evita que el formulario recargue la página
    setError("") // Limpia errores anteriores

    // VALIDACIÓN: La contraseña debe tener al menos 6 caracteres
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      // PETICIÓN HTTP: POST al endpoint de registro del backend
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username: username,
        password: password,
      })

      // ALMACENAMIENTO: Guarda el token y rol por defecto
      const token = response.data.token
      localStorage.setItem("token", token)
      localStorage.setItem("role", "ROLE_USER") // Todos los nuevos usuarios tienen rol USER
      localStorage.setItem("username", username) // Guardamos el nombre de usuario

      // REDIRECCIÓN: Lleva al usuario al dashboard después del registro exitoso
      navigate("/dashboard")
    } catch (err) {
      // MANEJO DE ERRORES: Muestra mensajes específicos según el tipo de error
      console.error("Error en el registro:", err)
      if (err.response && err.response.status === 400) {
        setError("El nombre de usuario ya existe. Por favor, elige otro.")
      } else {
        setError("No se pudo completar el registro. Inténtalo de nuevo.")
      }
    }
  }

  return (
    <AuthLayout>
      {/* FORMULARIO: Captura los datos del nuevo usuario */}
      <form className="login-form" onSubmit={handleRegister}>
        <h1>Crear Cuenta</h1>

        {/* MENSAJE DE ERROR: Solo se muestra si hay un error */}
        {error && <p className="error-message">{error}</p>}

        {/* INPUT: Nombre de usuario */}
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            placeholder="Elige un nombre de usuario" // Agregado placeholder para claridad
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* INPUT: Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Mínimo 6 caracteres" // Agregado placeholder con requisito de contraseña
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN: Envía el formulario */}
        <button type="submit" className="login-button">
          Registrarse
        </button>

        {/* ENLACE: Lleva a la página de login si ya tiene cuenta */}
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
