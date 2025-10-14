// ARCHIVO: AdminPanel.jsx
// PROPÓSITO: Panel de administración donde los usuarios con ROLE_ADMIN pueden ver y gestionar
// todas las mascotas de todos los usuarios del sistema

"use client"

import { useState, useEffect } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
import "./AdminPanel.css"

function AdminPanel() {
  const [allPets, setAllPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [stats, setStats] = useState({ totalPets: 0, totalUsers: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [editingPet, setEditingPet] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "ROLE_ADMIN") {
      navigate("/dashboard")
      return
    }

    fetchAllPets()
  }, [navigate])

  const fetchAllPets = async () => {
    try {
      const response = await axios.get("/admin/pets")

      setAllPets(response.data)

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

      if (err.response?.status === 403 || err.response?.status === 401) {
        navigate("/dashboard")
      }
    }
  }

  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la mascota "${petName}"?`)) return

    try {
      await axios.delete(`/admin/pets/${petId}`)

      setAllPets(allPets.filter((pet) => pet.id !== petId))

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

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    navigate("/login")
  }

  const handleEditPet = (pet) => {
    setEditingPet({ ...pet })
  }

  const handleSaveEdit = async () => {
    if (!editingPet) return

    try {
      await axios.put(`/admin/pets/${editingPet.id}`, {
        hunger: editingPet.hunger,
        happiness: editingPet.happiness,
      })

      setAllPets(allPets.map((pet) => (pet.id === editingPet.id ? editingPet : pet)))
      setEditingPet(null)
      alert("Mascota actualizada correctamente")
    } catch (err) {
      console.error("Error al actualizar mascota:", err)
      alert("No se pudo actualizar la mascota. Inténtalo de nuevo.")
    }
  }

  const handleCancelEdit = () => {
    setEditingPet(null)
  }

  const filteredAndSortedPets = allPets
    .filter((pet) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        pet.name.toLowerCase().includes(searchLower) ||
        pet.username?.toLowerCase().includes(searchLower) ||
        pet.id.toString().includes(searchLower)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "hunger":
          return b.hunger - a.hunger
        case "happiness":
          return a.happiness - b.happiness
        case "id":
        default:
          return a.id - b.id
      }
    })

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
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <div className="admin-actions">
          <button className="refresh-button" onClick={fetchAllPets} title="Refrescar datos">
            🔄 Refrescar
          </button>
          <button className="back-button" onClick={handleBackToDashboard}>
            Volver al Dashboard
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>

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

      <div className="pets-table-container">
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="sort-box">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="id">ID</option>
              <option value="name">Nombre</option>
              <option value="hunger">Hambre (mayor a menor)</option>
              <option value="happiness">Felicidad (menor a mayor)</option>
            </select>
          </div>
        </div>

        <h2>
          Todas las Mascotas del Sistema ({filteredAndSortedPets.length} de {allPets.length})
        </h2>
        {filteredAndSortedPets.length === 0 ? (
          <p className="no-pets">
            {searchTerm ? "No se encontraron mascotas con ese criterio de búsqueda." : "No hay mascotas en el sistema."}
          </p>
        ) : (
          <table className="pets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Hambre</th>
                <th>Felicidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedPets.map((pet) => (
                <tr key={pet.id}>
                  <td>{pet.id}</td>
                  <td>{pet.name}</td>
                  <td>{pet.username || `Usuario #${pet.userId}`}</td>
                  <td>
                    {editingPet?.id === pet.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingPet.hunger}
                        onChange={(e) => setEditingPet({ ...editingPet, hunger: Number.parseInt(e.target.value) || 0 })}
                        className="stat-input"
                      />
                    ) : (
                      <div className="stat-bar">
                        <div className="stat-fill hunger" style={{ width: `${pet.hunger}%` }}></div>
                        <span className="stat-text">{pet.hunger}%</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingPet?.id === pet.id ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingPet.happiness}
                        onChange={(e) =>
                          setEditingPet({ ...editingPet, happiness: Number.parseInt(e.target.value) || 0 })
                        }
                        className="stat-input"
                      />
                    ) : (
                      <div className="stat-bar">
                        <div className="stat-fill happiness" style={{ width: `${pet.happiness}%` }}></div>
                        <span className="stat-text">{pet.happiness}%</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {editingPet?.id === pet.id ? (
                        <>
                          <button className="save-button" onClick={handleSaveEdit}>
                            Guardar
                          </button>
                          <button className="cancel-button" onClick={handleCancelEdit}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="edit-button" onClick={() => handleEditPet(pet)}>
                            Editar
                          </button>
                          <button className="delete-button" onClick={() => handleDeletePet(pet.id, pet.name)}>
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
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
