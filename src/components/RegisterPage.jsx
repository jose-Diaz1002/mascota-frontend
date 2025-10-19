// ARCHIVO: RegisterPage.jsx
// PROPÓSITO: Página de registro donde nuevos usuarios crean su cuenta
// Envía los datos al backend y si es exitoso, guarda el token y redirige al dashboard

"use client"

import { useState, useEffect } from "react"
import axios from "../api/axios"
import { useNavigate, Link } from "react-router-dom"
import "./LoginPage.css"
import AuthLayout from "./AuthLayout"

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    console.log("[v0] RegisterPage - Componente montado!")
    console.log("[v0] RegisterPage - URL actual:", window.location.href)
    console.log("[v0] RegisterPage - pathname:", window.location.pathname)
  }, [])

  const handleRegister = async (event) => {
    event.preventDefault()
    setError("")

    console.log("[v0] RegisterPage - Iniciando registro para:", username)

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      console.log("[v0] RegisterPage - Enviando petición de registro...")
      const response = await axios.post("/auth/register", {
        username: username,
        password: password,
      })

      console.log("[v0] RegisterPage - Registro exitoso, respuesta:", response.data)

      const token = response.data.token
      localStorage.setItem("token", token)
      localStorage.setItem("role", "ROLE_USER")
      localStorage.setItem("username", username)

      console.log("[v0] RegisterPage - Token guardado, navegando a /dashboard...")
      navigate("/dashboard")
      console.log("[v0] RegisterPage - navigate() ejecutado")
    } catch (err) {
      console.error("[v0] RegisterPage - Error en el registro:", err)
      if (err.response && err.response.status === 400) {
        setError("El nombre de usuario ya existe. Por favor, elige otro.")
      } else {
        setError("No se pudo completar el registro. Inténtalo de nuevo.")
      }
    }
  }

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
            placeholder="Elige un nombre de usuario"
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Registrarse
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
