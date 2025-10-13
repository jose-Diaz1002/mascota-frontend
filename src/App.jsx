// ARCHIVO: App.jsx
// PROPÓSITO: Este es el componente principal que maneja todas las rutas de la aplicación
// Usa React Router para navegar entre páginas (Login, Registro, Dashboard)

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import PetDashboard from "./components/PetDashboard"
import RegisterPage from "./components/RegisterPage"
import AdminPanel from "./components/AdminPanel"

// FUNCIÓN: isAuthenticated
// PROPÓSITO: Verifica si el usuario tiene un token guardado en localStorage
// RETORNA: true si hay token (usuario autenticado), false si no hay token
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null
}

// COMPONENTE: PrivateRoute
// PROPÓSITO: Protege rutas privadas - solo usuarios autenticados pueden acceder
// Si el usuario NO está autenticado, lo redirige a /login
// Si el usuario SÍ está autenticado, muestra el contenido (children)
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

// COMPONENTE: AdminRoute
// PROPÓSITO: Protege rutas de administrador - solo usuarios con ROLE_ADMIN pueden acceder
// Si el usuario NO está autenticado, lo redirige a /login
// Si el usuario SÍ está autenticado pero NO es admin, lo redirige a /dashboard
// Si el usuario ES admin, muestra el contenido (children)
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role")
  const isAuth = isAuthenticated()

  // Si no está autenticado, redirige a login
  if (!isAuth) {
    return <Navigate to="/login" />
  }

  // Si está autenticado pero no es admin, redirige a dashboard
  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" />
  }

  // Si es admin, muestra el contenido
  return children
}

function App() {
  return (
    // Router: Envuelve toda la aplicación para habilitar la navegación entre páginas
    <Router>
      {/* Routes: Define todas las rutas disponibles en la aplicación */}
      <Routes>
        {/* RUTA PÚBLICA: /login - Página de inicio de sesión */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTA PÚBLICA: /register - Página de registro de nuevos usuarios */}
        <Route path="/register" element={<RegisterPage />} />

        {/* RUTA PRIVADA: /dashboard - Panel principal con las mascotas */}
        {/* Solo accesible si el usuario está autenticado (tiene token) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PetDashboard />
            </PrivateRoute>
          }
        />

        {/* RUTA PRIVADA: /admin - Panel de administración */}
        {/* Solo accesible para usuarios con ROLE_ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* RUTA COMODÍN: * - Captura cualquier ruta no definida */}
        {/* Si el usuario está autenticado → va a /dashboard */}
        {/* Si NO está autenticado → va a /login */}
        <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
