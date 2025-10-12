"use client"

// --- 1. IMPORTACIONES ---
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import PetView from "./PetView.jsx"
import AccessoryPanel from "./AccessoryPanel.jsx"
import PetCard from "./PetCard.jsx"
import "./PetDashboard.css"

function PetDashboard() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState("")
  const [newColor, setNewColor] = useState("#FFA500")
  const [isAccessoryPanelOpen, setAccessoryPanelOpen] = useState(false)

  const [isHovering, setIsHovering] = useState(false)

  const happinessIncreaseInterval = useRef(null)
  const happinessDecreaseInterval = useRef(null)

  const activePet = pets.length > 0 ? pets[0] : null

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    window.location.href = "/login"
  }, [])

  const fetchPets = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        handleLogout()
        return
      }

      const response = await axios.get("http://localhost:8080/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setPets(response.data)
    } catch (error) {
      console.error("Error al cargar las mascotas", error)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout()
      }
    } finally {
      setLoading(false)
    }
  }, [handleLogout])

  useEffect(() => {
    fetchPets()
    const intervalId = setInterval(fetchPets, 10000)
    return () => clearInterval(intervalId)
  }, [fetchPets])

  useEffect(() => {
    if (isHovering && activePet) {
      // Aumentar felicidad cada 500ms mientras se hace hover
      happinessIncreaseInterval.current = setInterval(async () => {
        try {
          const token = localStorage.getItem("token")
          const response = await axios.post(
            `http://localhost:8080/api/pets/${activePet.id}/cuddle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
          // Actualizar solo la mascota afectada
          setPets((currentPets) => currentPets.map((p) => (p.id === response.data.id ? response.data : p)))
        } catch (error) {
          console.error("Error al aumentar felicidad", error)
        }
      }, 500) // Cambiado de 100ms a 500ms
    } else {
      // Limpiar el intervalo cuando no se hace hover
      if (happinessIncreaseInterval.current) {
        clearInterval(happinessIncreaseInterval.current)
        happinessIncreaseInterval.current = null
      }
    }

    return () => {
      if (happinessIncreaseInterval.current) {
        clearInterval(happinessIncreaseInterval.current)
      }
    }
  }, [isHovering, activePet])

  useEffect(() => {
    if (activePet) {
      // Disminuir felicidad cada 2 segundos
      happinessDecreaseInterval.current = setInterval(async () => {
        try {
          const token = localStorage.getItem("token")
          // Llamar a un endpoint para disminuir felicidad (necesitarás crear este endpoint)
          const response = await axios.post(
            `http://localhost:8080/api/pets/${activePet.id}/decrease-happiness`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
          setPets((currentPets) => currentPets.map((p) => (p.id === response.data.id ? response.data : p)))
        } catch (error) {
          // Si el endpoint no existe, disminuir localmente
          setPets((currentPets) =>
            currentPets.map((p) => {
              if (p.id === activePet.id) {
                return { ...p, happiness: Math.max(0, p.happiness - 1) }
              }
              return p
            }),
          )
        }
      }, 2000) // Cada 2 segundos
    }

    return () => {
      if (happinessDecreaseInterval.current) {
        clearInterval(happinessDecreaseInterval.current)
      }
    }
  }, [activePet])

  const updatePetState = useCallback((updatedPet) => {
    setPets((currentPets) => currentPets.map((p) => (p.id === updatedPet.id ? updatedPet : p)))
  }, [])

  const handleCreatePet = useCallback(
    async (e) => {
      e.preventDefault()
      const token = localStorage.getItem("token")
      try {
        await axios.post(
          "http://localhost:8080/api/pets",
          { name: newName, color: newColor },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setNewName("")
        setNewColor("#FFA500")
        fetchPets()
      } catch (error) {
        console.error("Error al crear la mascota", error)
      }
    },
    [newName, newColor, fetchPets],
  )

  const handleFeed = useCallback(
    async (petId) => {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `http://localhost:8080/api/pets/${petId}/feed`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      updatePetState(res.data)
    },
    [updatePetState],
  )

  const handleEquipAccessory = useCallback(
    async (petId, accessoryType, accessoryName) => {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `http://localhost:8080/api/pets/${petId}/equip`,
        { accessoryType, accessoryName: accessoryName || "" },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      updatePetState(res.data)
    },
    [updatePetState],
  )

  const handleDelete = useCallback(
    async (petId) => {
      if (window.confirm("¿Estás seguro?")) {
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, { headers: { Authorization: `Bearer ${token}` } })
        fetchPets()
      }
    },
    [fetchPets],
  )

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  const handleCuddle = useCallback(
    async (petId) => {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        `http://localhost:8080/api/pets/${petId}/cuddle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      updatePetState(res.data)
    },
    [updatePetState],
  )

  return (
    <div className="dashboard-layout">
      <div className="control-panel">
        <h3>Panel de Control</h3>
        <hr className="separator" />

        {loading && pets.length === 0 ? (
          <p>Cargando...</p>
        ) : activePet ? (
          <>
            <PetCard
              pet={activePet}
              onFeed={handleFeed}
              onCuddle={handleCuddle}
              onCustomize={() => setAccessoryPanelOpen(true)}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <div className="creation-hub">
            <h3>¡Crea tu mascota!</h3>
            <form onSubmit={handleCreatePet} className="creation-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre"
                required
              />
              
              <button type="submit">Crear</button>
            </form>
          </div>
        )}
        <button onClick={handleLogout} style={{ marginTop: "auto" }} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="pet-view-area">
        {activePet ? (
          <PetView pet={activePet} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
        ) : (
          <div className="no-pets-message">
            <h1>¡Bienvenido!</h1>
            <p>Crea una mascota para empezar.</p>
          </div>
        )}
      </div>

      {isAccessoryPanelOpen && activePet && (
        <AccessoryPanel
          pet={activePet}
          onEquipAccessory={handleEquipAccessory}
          onClose={() => setAccessoryPanelOpen(false)}
        />
      )}
    </div>
  )
}

export default PetDashboard
