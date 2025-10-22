"use client"

import { useState, useEffect, useRef } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
import PetCard from "./PetCard"
import PetView from "./PetView"
import "./PetDashboard.css"

function PetDashboard() {
  const [pets, setPets] = useState([])
  const [activePet, setActivePet] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPetName, setNewPetName] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [backendSaveAvailable, setBackendSaveAvailable] = useState(true)
  const [backendError, setBackendError] = useState("")
  const navigate = useNavigate()

  const happinessIntervalRef = useRef(null)
  const hungerIntervalRef = useRef(null)
  const hoverIntervalRef = useRef(null)
  const saveIntervalRef = useRef(null)
  const currentPetIdRef = useRef(null)

  useEffect(() => {
    fetchPets()

    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    const storedRole = localStorage.getItem("role")
    console.log("[v0] Rol cargado desde localStorage:", storedRole)
    if (storedRole) {
      setUserRole(storedRole)
    }
  }, [])

  useEffect(() => {
    if (!activePet || !backendSaveAvailable) {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current)
        saveIntervalRef.current = null
      }
      return
    }

    console.log("[v0] Iniciando intervalo de guardado para pet ID:", activePet.id)

    saveIntervalRef.current = setInterval(() => {
      console.log("[v0] Guardando stats en backend:", {
        hunger: activePet.hunger,
        happiness: activePet.happiness,
      })
      updatePetStats(activePet.id, {
        name: activePet.name,
        hunger: activePet.hunger,
        happiness: activePet.happiness,
        color: activePet.color,
        hat: activePet.hat,
        shirt: activePet.shirt,
      })
    }, 10000)

    return () => {
      if (saveIntervalRef.current) {
        console.log("[v0] Limpiando intervalo de guardado")
        clearInterval(saveIntervalRef.current)
        saveIntervalRef.current = null
      }
    }
  }, [activePet, backendSaveAvailable])

  useEffect(() => {
    if (!activePet) return

    const syncInterval = setInterval(() => {
      console.log("[v0] Sincronizando con backend...")
      syncWithBackendGradually()
    }, 10000) // Sincroniza cada 10 segundos

    return () => clearInterval(syncInterval)
  }, [activePet])

  useEffect(() => {
    if (!activePet) {
      if (happinessIntervalRef.current) {
        clearInterval(happinessIntervalRef.current)
        happinessIntervalRef.current = null
      }
      if (hungerIntervalRef.current) {
        clearInterval(hungerIntervalRef.current)
        hungerIntervalRef.current = null
      }
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
        hoverIntervalRef.current = null
      }
      currentPetIdRef.current = null
      return
    }

    if (currentPetIdRef.current !== activePet.id) {
      console.log("[v0] Mascota cambió, reiniciando intervalos para pet ID:", activePet.id)
      currentPetIdRef.current = activePet.id

      if (happinessIntervalRef.current) clearInterval(happinessIntervalRef.current)
      if (hungerIntervalRef.current) clearInterval(hungerIntervalRef.current)

      happinessIntervalRef.current = setInterval(() => {
        setActivePet((prev) => {
          if (!prev) return prev
          const newHappiness = Math.max(0, prev.happiness - 1)
          console.log("[v0] Felicidad disminuyendo:", prev.happiness, "→", newHappiness)
          return { ...prev, happiness: newHappiness }
        })
      }, 10000)

      hungerIntervalRef.current = setInterval(() => {
        setActivePet((prev) => {
          if (!prev) {
            console.log("[v0] ADVERTENCIA: prev es null en intervalo de hambre")
            return prev
          }
          const currentHunger = prev.hunger
          const newHunger = Math.min(100, currentHunger + 2)
          console.log("[v0] Hambre aumentando:", currentHunger, "→", newHunger, "| Pet ID:", prev.id)
          return { ...prev, hunger: newHunger }
        })
      }, 2000) // Cambiado de 5000ms a 2000ms y aumenta +2 en lugar de +1
    }

    return () => {
      if (happinessIntervalRef.current) clearInterval(happinessIntervalRef.current)
      if (hungerIntervalRef.current) clearInterval(hungerIntervalRef.current)
    }
  }, [activePet])

  useEffect(() => {
    if (!activePet || !isHovering) {
      if (hoverIntervalRef.current) {
        console.log("[v0] Limpiando intervalo de hover")
        clearInterval(hoverIntervalRef.current)
        hoverIntervalRef.current = null
      }
      return
    }

    console.log("[v0] Iniciando intervalo de hover para pet ID:", activePet.id)

    hoverIntervalRef.current = setInterval(() => {
      setActivePet((prev) => {
        if (!prev) return prev
        const newHappiness = Math.min(100, prev.happiness + 2)
        console.log("[v0] Felicidad aumentando por hover:", prev.happiness, "→", newHappiness)
        return { ...prev, happiness: newHappiness }
      })
    }, 500)

    return () => {
      if (hoverIntervalRef.current) {
        console.log("[v0] Limpiando intervalo de hover")
        clearInterval(hoverIntervalRef.current)
        hoverIntervalRef.current = null
      }
    }
  }, [activePet, isHovering])

  const fetchPets = async () => {
    try {
      const response = await axios.get("/pets")

      setPets(response.data)

      if (response.data.length > 0) {
        setActivePet(response.data[0])
      }
    } catch (err) {
      console.error("Error al obtener mascotas:", err)

      if (err.response?.status === 401) {
        navigate("/login")
      }
    }
  }

  const syncWithBackendGradually = async () => {
    if (!activePet) return

    try {
      const response = await axios.get("/pets")
      const backendPets = response.data

      // Actualizar la lista completa de mascotas
      setPets(backendPets)

      // Encontrar la mascota activa en los datos del backend
      const backendActivePet = backendPets.find((p) => p.id === activePet.id)

      if (!backendActivePet) {
        console.log("[v0] Mascota activa no encontrada en backend")
        return
      }

      // Calcular la diferencia entre backend y local
      const hungerDiff = backendActivePet.hunger - activePet.hunger
      const happinessDiff = backendActivePet.happiness - activePet.happiness

      console.log("[v0] Diferencias detectadas - Hambre:", hungerDiff, "Felicidad:", happinessDiff)

      // Aplicar cambios graduales (máximo 20 puntos por sincronización)
      const MAX_CHANGE = 20

      let newHunger = activePet.hunger
      let newHappiness = activePet.happiness

      // Aplicar cambio gradual de hambre
      if (Math.abs(hungerDiff) > MAX_CHANGE) {
        // Si la diferencia es mayor a 20, aplicar solo 20 en la dirección correcta
        newHunger = activePet.hunger + (hungerDiff > 0 ? MAX_CHANGE : -MAX_CHANGE)
        console.log("[v0] Aplicando cambio gradual de hambre:", activePet.hunger, "→", newHunger)
      } else if (hungerDiff !== 0) {
        // Si la diferencia es menor a 20, aplicar toda la diferencia
        newHunger = backendActivePet.hunger
        console.log("[v0] Aplicando cambio completo de hambre:", activePet.hunger, "→", newHunger)
      }

      // Aplicar cambio gradual de felicidad
      if (Math.abs(happinessDiff) > MAX_CHANGE) {
        newHappiness = activePet.happiness + (happinessDiff > 0 ? MAX_CHANGE : -MAX_CHANGE)
        console.log("[v0] Aplicando cambio gradual de felicidad:", activePet.happiness, "→", newHappiness)
      } else if (happinessDiff !== 0) {
        newHappiness = backendActivePet.happiness
        console.log("[v0] Aplicando cambio completo de felicidad:", activePet.happiness, "→", newHappiness)
      }

      // Actualizar activePet con los nuevos valores graduales
      setActivePet({
        ...backendActivePet,
        hunger: Math.max(0, Math.min(100, newHunger)),
        happiness: Math.max(0, Math.min(100, newHappiness)),
      })
    } catch (err) {
      console.error("[v0] Error al sincronizar con backend:", err)
      if (err.response?.status === 401) {
        navigate("/login")
      }
    }
  }

  const updatePetStats = async (petId, stats) => {
    try {
      await axios.put(`/pets/${petId}`, stats)
      console.log("[v0] Stats guardados exitosamente en backend")
      if (backendError) {
        setBackendError("")
      }
    } catch (err) {
      if (err.response?.status === 405) {
        console.error("[v0] ERROR: El backend no soporta el método PUT en /pets/{id}")
        console.error("[v0] Necesitas agregar el endpoint PUT en PetController.java")
        setBackendSaveAvailable(false)
        setBackendError(
          "El backend no tiene configurado el guardado automático. Los cambios solo se guardarán al cerrar sesión.",
        )
      } else if (err.response?.status === 404) {
        console.error("[v0] ERROR: Endpoint /pets/{id} no encontrado en el backend")
        setBackendSaveAvailable(false)
        setBackendError("Endpoint de guardado no encontrado. Los cambios solo se guardarán al cerrar sesión.")
      } else if (err.response?.status === 403) {
        console.warn("[v0] No tienes permisos para actualizar esta mascota")
        setBackendError("No tienes permisos para actualizar esta mascota.")
      } else {
        console.error("[v0] Error al actualizar estadísticas:", err)
      }
    }
  }

  const handleCreatePet = async (event) => {
    event.preventDefault()
    console.log("[v0] handleCreatePet - Iniciando creación de mascota:", newPetName)
    setError("")

    if (!newPetName.trim()) {
      setError("El nombre de la mascota es obligatorio.")
      return
    }

    try {
      console.log("[v0] handleCreatePet - Enviando petición POST /pets")
      const response = await axios.post("/pets", {
        name: newPetName,
        hunger: 100,
        happiness: 50,
        color: 0,
      })

      console.log("[v0] handleCreatePet - Mascota creada exitosamente:", response.data)
      setPets([...pets, response.data])
      setActivePet(response.data)

      setNewPetName("")
      setShowCreateForm(false)
    } catch (err) {
      console.error("[v0] handleCreatePet - Error al crear mascota:", err)
      console.error("[v0] handleCreatePet - Error status:", err.response?.status)
      console.error("[v0] handleCreatePet - Error data:", err.response?.data)
      setError("No se pudo crear la mascota. Inténtalo de nuevo.")
    }
  }

  const handleFeed = () => {
    if (!activePet) return

    const newHunger = Math.max(0, activePet.hunger - 30)
    setActivePet({ ...activePet, hunger: newHunger })
  }

  const handleMouseEnter = () => {
    if (!activePet) return
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  const handleColorChange = (colorValue) => {
    if (!activePet) return

    setActivePet({ ...activePet, color: colorValue })
  }

  const handleDelete = async (petId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return

    try {
      await axios.delete(`/pets/${petId}`)

      const updatedPets = pets.filter((p) => p.id !== petId)
      setPets(updatedPets)

      setActivePet(updatedPets.length > 0 ? updatedPets[0] : null)
    } catch (err) {
      console.error("Error al eliminar mascota:", err)
    }
  }

  const handleLogout = () => {
    if (activePet) {
      updatePetStats(activePet.id, {
        name: activePet.name,
        hunger: activePet.hunger,
        happiness: activePet.happiness,
        color: activePet.color,
        hat: activePet.hat,
        shirt: activePet.shirt,
      })
    }

    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    navigate("/login")
  }

  const handleGoToAdmin = () => {
    navigate("/admin")
  }

  return (
    <div className="dashboard-container">
      <div className="control-panel">
        {username && (
          <div className="user-info">
            <h2>Hola, {username}</h2>
            {console.log("[v0] userRole actual:", userRole, "¿Es admin?", userRole === "ROLE_ADMIN")}
            {userRole === "ROLE_ADMIN" && (
              <button className="admin-button" onClick={handleGoToAdmin}>
                Panel Admin
              </button>
            )}
          </div>
        )}

        {backendError && (
          <div
            className="backend-warning"
            style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              padding: "12px",
              marginBottom: "16px",
              color: "#856404",
            }}
          >
            <strong>⚠️ Advertencia:</strong> {backendError}
          </div>
        )}

        <hr className="separator" />

        {activePet ? (
          <PetCard pet={activePet} onFeed={handleFeed} onDelete={handleDelete} onColorChange={handleColorChange} />
        ) : (
          <div className="creation-hub">
            <h3>¡Crea tu mascota!</h3>
            {!showCreateForm ? (
              <button className="create-pet-button" onClick={() => setShowCreateForm(true)}>
                Crear Nueva Mascota
              </button>
            ) : (
              <form className="create-pet-form" onSubmit={handleCreatePet}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                  <input
                    type="text"
                    id="petName"
                    placeholder="Nombre de la mascota"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Crear
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setNewPetName("")
                      setError("")
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="pet-view-area">
        {activePet ? (
          <PetView
            pet={activePet}
            isHovering={isHovering}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ) : (
          <div className="no-pet-message">
            <h1>¡Bienvenido!</h1>
            <p>Crea una mascota para empezar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PetDashboard
