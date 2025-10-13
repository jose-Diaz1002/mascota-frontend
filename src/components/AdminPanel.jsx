// ARCHIVO: AdminPanel.jsx
// PROPÓSITO: Panel de administración donde los usuarios con ROLE_ADMIN pueden ver y gestionar
// todas las mascotas de todos los usuarios del sistema

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./AdminPanel.css"

function AdminPanel() {
  // ESTADOS: Almacenan la información del panel de administración
  const [allPets, setAllPets] = useState([]) // Todas las mascotas del sistema
  const [loading, setLoading] = useState(true) // Estado de carga
  const [error, setError] = useState("") // Mensajes de error
  const [stats, setStats] = useState({ totalPets: 0, totalUsers: 0 }) // Estadísticas generales
  const navigate = useNavigate()

  // EFECTO: Se ejecuta al montar el componente
  // Verifica que el usuario sea admin y carga todas las mascotas
  useEffect(() => {
    // Verificar que el usuario tenga rol de administrador
    const role = localStorage.getItem("role")
    if (role !== "ROLE_ADMIN") {
      // Si no es admin, redirige al dashboard
      navigate("/dashboard")
      return
    }

    fetchAllPets()
  }, [navigate])

  // FUNCIÓN: fetchAllPets
  // PROPÓSITO: Obtiene TODAS las mascotas del sistema (solo admins pueden hacer esto)
  const fetchAllPets = async () => {
    try {
      const token = localStorage.getItem("token")

      // GET request al endpoint de admin que devuelve todas las mascotas
      // Este endpoint solo es accesible para usuarios con ROLE_ADMIN
      const response = await axios.get("http://localhost:8080/api/admin/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })

      setAllPets(response.data)

      // Calcular estadísticas
      const uniqueUsers = new Set(response.data.map((pet) => pet.userId)).size
      setStats({
        totalPets: response.data.length,
        totalUsers: uniqueUsers,
      })

      setLoading(false)
    } catch (err) {
      console.error("Error al obtener mascotas:", err)
      setError("No se pudieron cargar las mascotas. Verifica que tengas permisos de administrador.")
      setLoading(false)

      // Si hay error de autorización, redirige al dashboard
      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate("/dashboard")
      }
    }
  }

  // FUNCIÓN: handleDeletePet
  // PROPÓSITO: Permite al admin eliminar cualquier mascota del sistema
  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la mascota "${petName}"?`)) return

    try {
      const token = localStorage.getItem("token")

      // DELETE request usando el endpoint de admin
      await axios.delete(`http://localhost:8080/api/admin/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Actualiza la lista local removiendo la mascota eliminada
      setAllPets(allPets.filter((pet) => pet.id !== petId))

      // Actualiza las estadísticas
      const uniqueUsers = new Set(allPets.filter((pet) => pet.id !== petId).map((pet) => pet.userId)).size
      setStats({
        totalPets: allPets.length - 1,
        totalUsers: uniqueUsers,
      })
    } catch (err) {
      console.error("Error al eliminar mascota:", err)
      alert("No se pudo eliminar la mascota. Inténtalo de nuevo.")
    }
  }

  // FUNCIÓN: handleBackToDashboard
  // PROPÓSITO: Regresa al dashboard normal
  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  // FUNCIÓN: handleLogout
  // PROPÓSITO: Cierra la sesión del administrador
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    navigate("/login")
  }

  // RENDERIZADO CONDICIONAL: Muestra loading, error o el panel
  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Cargando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-panel">
        <div className="error-message">{error}</div>
        <button onClick={handleBackToDashboard}>Volver al Dashboard</button>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      {/* HEADER: Título y botones de navegación */}
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-actions">
          <button className="back-button" onClick={handleBackToDashboard}>
            Volver al Dashboard
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS: Muestra información general del sistema */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total de Mascotas</h3>
          <p className="stat-number">{stats.totalPets}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Usuarios</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
      </div>

      {/* TABLA: Lista de todas las mascotas del sistema */}
      <div className="pets-table-container">
        <h2>Todas las Mascotas del Sistema</h2>
        {allPets.length === 0 ? (
          <p className="no-pets">No hay mascotas en el sistema.</p>
        ) : (
          <table className="pets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Propietario (User ID)</th>
                <th>Hambre</th>
                <th>Felicidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allPets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>{pet.name}</td>
                  <td>{pet.userId}</td>
                  <td>
                    <div className="stat-bar">
                      <div className="stat-fill hunger" style={{ width: `${pet.hunger}%` }}></div>
                      <span className="stat-text">{pet.hunger}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="stat-bar">
                      <div className="stat-fill happiness" style={{ width: `${pet.happiness}%` }}></div>
                      <span className="stat-text">{pet.happiness}%</span>
                    </div>
                  </td>
                  <td>
                    <button className="delete-button" onClick={() => handleDeletePet(pet.id, pet.name)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
