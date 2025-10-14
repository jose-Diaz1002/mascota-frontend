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
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInstance
