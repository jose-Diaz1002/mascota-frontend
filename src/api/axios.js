// ARCHIVO: axios.js
// PROPÓSITO: Configuración global de axios para todas las peticiones al backend
// Configura la URL base y habilita el envío de credenciales (necesario para CORS)

import axios from "axios"

// Crear instancia de axios con configuración personalizada
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // URL base del backend
  withCredentials: true, // Envía cookies y headers de autenticación (necesario para CORS)
  headers: {
    "Content-Type": "application/json", // Tipo de contenido por defecto
  },
})

// Interceptor para agregar el token JWT a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("[v0] Axios interceptor - URL:", config.url)

    const isAuthEndpoint =
      config.url?.startsWith("/auth/") || config.url?.includes("/auth/login") || config.url?.includes("/auth/register")

    console.log("[v0] Axios interceptor - isAuthEndpoint:", isAuthEndpoint)

    if (!isAuthEndpoint) {
      const token = localStorage.getItem("token")
      if (token) {
        console.log("[v0] Axios interceptor - Agregando token")
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.log("[v0] Axios interceptor - No hay token en localStorage")
      }
    } else {
      console.log("[v0] Axios interceptor - Endpoint de auth, NO agregando token")
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response
  },
  (error) => {
    // Si hay un error 401 (Unauthorized), significa que el token expiró o es inválido
    if (error.response && error.response.status === 401) {
      console.log("[v0] Token expirado o inválido (401), limpiando localStorage y redirigiendo a login")

      // Limpiar el localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      localStorage.removeItem("username")

      // Redirigir al login
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
