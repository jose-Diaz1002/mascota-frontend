// ARCHIVO: LoginPage.jsx
// PROPÓSITO: Página de inicio de sesión donde los usuarios ingresan sus credenciales
// Envía las credenciales al backend y guarda el token JWT si el login es exitoso

"use client"

import { useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
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

    console.log("[v0] LoginPage - Iniciando login para:", username)

    try {
      console.log("[v0] LoginPage - Enviando petición de login...")
      const response = await axios.post("/auth/login", {
        username: username,
        password: password,
      })

      console.log("[v0] LoginPage - Login exitoso, respuesta:", response.data)

      // DECODIFICACIÓN DEL TOKEN JWT
      const { jwtDecode } = await import("jwt-decode")
      const decodedToken = jwtDecode(response.data.token)

      console.log("[v0] Token decodificado:", decodedToken)
      const userRole = decodedToken.role[0] // Extraer el primer rol del array
      console.log("[v0] Rol extraído:", userRole)

      // ALMACENAMIENTO LOCAL
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", userRole) // Guardar el rol correctamente
      localStorage.setItem("username", username)

      console.log("[v0] Datos guardados en localStorage - role:", localStorage.getItem("role"))

      // REDIRECCIÓN
      console.log("[v0] LoginPage - Navegando a /dashboard...")
      navigate("/dashboard")
      console.log("[v0] LoginPage - navigate() ejecutado")
    } catch (err) {
      console.error("[v0] LoginPage - Error en el login:", err)
      setError("Usuario o contraseña incorrectos.")
    }
  }

  const goToRegister = () => {
    console.log("[v0] LoginPage - Navegando a /register...")
    navigate("/register")
    console.log("[v0] LoginPage - navigate('/register') ejecutado")
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
            placeholder="Ingresa tu nombre de usuario"
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
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN: Envía el formulario */}
        <button type="submit" className="login-button">
          Ingresar
        </button>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>¿No tienes una cuenta?</p>
          <button
            type="button"
            onClick={goToRegister}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            Ir a Registro
          </button>
        </div>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
