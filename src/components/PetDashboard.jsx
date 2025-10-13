"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import PetCard from "./PetCard"
import PetView from "./PetView"
import "./PetDashboard.css"

function PetDashboard() {
  // ESTADOS: Almacenan toda la información necesaria para el dashboard
  const [pets, setPets] = useState([]) // Array con todas las mascotas del usuario
  const [activePet, setActivePet] = useState(null) // Renombrado de selectedPet a activePet para claridad
  const [showCreateForm, setShowCreateForm] = useState(false) // Controla si se muestra el formulario de creación
  const [newPetName, setNewPetName] = useState("") // Nombre de la nueva mascota
  const [error, setError] = useState("") // Mensajes de error
  const [username, setUsername] = useState("") // Nombre del usuario logueado
  const [userRole, setUserRole] = useState("")
  const [isHovering, setIsHovering] = useState(false) // Nuevo estado para controlar cuando el ratón está sobre la mascota
  const navigate = useNavigate()

  // EFECTO 1: Se ejecuta UNA VEZ cuando el componente se monta (carga inicial)
  useEffect(() => {
    fetchPets() // Obtiene las mascotas del backend

    // Recupera el nombre de usuario de localStorage
    const storedUsername = localStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    const storedRole = localStorage.getItem("role")
    if (storedRole) {
      setUserRole(storedRole)
    }
  }, [])

  useEffect(() => {
    if (!activePet) return

    const syncInterval = setInterval(() => {
      console.log("[v0] Sincronizando con backend...")
      fetchPets()
    }, 30000) // Cada 30 segundos

    return () => clearInterval(syncInterval)
  }, [activePet])

  // EFECTO 2: Controla la FELICIDAD de la mascota
  // La felicidad DISMINUYE automáticamente cada 1 segundo
  useEffect(() => {
    if (!activePet) return

    console.log("[v0] Iniciando intervalo de felicidad para pet ID:", activePet.id)

    const happinessInterval = setInterval(() => {
      setActivePet((prev) => {
        if (!prev) return prev
        const newHappiness = Math.max(0, prev.happiness - 1)
        console.log("[v0] Felicidad disminuyendo:", prev.happiness, "→", newHappiness)
        return { ...prev, happiness: newHappiness }
      })
    }, 60000) // Cambiado de 1000ms (1 seg) a 60000ms (60 seg) para sincronizar con backend

    return () => {
      console.log("[v0] Limpiando intervalo de felicidad")
      clearInterval(happinessInterval)
    }
  }, [activePet]) // Cambiado de [activePet] a [activePet?.id] para evitar recrear el intervalo

  // EFECTO 3: Controla el HAMBRE de la mascota
  // El hambre AUMENTA automáticamente cada 3 segundos
  useEffect(() => {
    if (!activePet) return

    console.log("[v0] Iniciando intervalo de hambre para pet ID:", activePet.id)

    const hungerInterval = setInterval(() => {
      setActivePet((prev) => {
        if (!prev) return prev
        const newHunger = Math.min(100, prev.hunger + 1) // Cambiado de +2 a +1 para sincronizar con backend
        console.log("[v0] Hambre aumentando:", prev.hunger, "→", newHunger)
        return { ...prev, hunger: newHunger }
      })
    }, 5000) // Cambiado de 3000ms (3 seg) a 5000ms (5 seg) para sincronizar con backend

    return () => {
      console.log("[v0] Limpiando intervalo de hambre")
      clearInterval(hungerInterval)
    }
  }, [activePet]) // Cambiado de [activePet] a [activePet?.id] para evitar recrear el intervalo

  // EFECTO 4: Controla el aumento de FELICIDAD mientras el ratón está sobre la mascota
  // La felicidad AUMENTA continuamente cada 500ms mientras isHovering es true
  useEffect(() => {
    if (!activePet || !isHovering) return

    console.log("[v0] Iniciando intervalo de hover para pet ID:", activePet.id)

    const hoverInterval = setInterval(() => {
      setActivePet((prev) => {
        if (!prev) return prev
        const newHappiness = Math.min(100, prev.happiness + 2)
        console.log("[v0] Felicidad aumentando por hover:", prev.happiness, "→", newHappiness)
        return { ...prev, happiness: newHappiness }
      })
    }, 500)

    return () => {
      console.log("[v0] Limpiando intervalo de hover")
      clearInterval(hoverInterval)
    }
  }, [activePet, isHovering]) // Cambiado de [activePet, isHovering] a [activePet?.id, isHovering]

  // FUNCIÓN: fetchPets
  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })

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

  // FUNCIÓN: updatePetStats
  const updatePetStats = async (petId, stats) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(`http://localhost:8080/api/pets/${petId}`, stats, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn("No tienes permisos para actualizar esta mascota")
      } else {
        console.error("Error al actualizar estadísticas:", err)
      }
    }
  }

  // FUNCIÓN: handleCreatePet
  const handleCreatePet = async (event) => {
    event.preventDefault()
    setError("")

    if (!newPetName.trim()) {
      setError("El nombre de la mascota es obligatorio.")
      return
    }

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        "http://localhost:8080/api/pets",
        {
          name: newPetName,
          hunger: 50,
          happiness: 50,
          color: 0,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setPets([...pets, response.data])
      setActivePet(response.data)

      setNewPetName("")
      setShowCreateForm(false)
    } catch (err) {
      console.error("Error al crear mascota:", err)
      setError("No se pudo crear la mascota. Inténtalo de nuevo.")
    }
  }

  const handleFeed = () => {
    if (!activePet) return

    const newHunger = Math.max(0, activePet.hunger - 30)
    setActivePet({ ...activePet, hunger: newHunger })
  }

  // FUNCIÓN: handleMouseEnter
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

  // FUNCIÓN: handleDelete
  const handleDelete = async (petId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(`http://localhost:8080/api/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const updatedPets = pets.filter((p) => p.id !== petId)
      setPets(updatedPets)

      setActivePet(updatedPets.length > 0 ? updatedPets[0] : null)
    } catch (err) {
      console.error("Error al eliminar mascota:", err)
    }
  }

  // FUNCIÓN: handleLogout
  const handleLogout = () => {
    if (activePet) {
      updatePetStats(activePet.id, {
        hunger: activePet.hunger,
        happiness: activePet.happiness,
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

  // RENDERIZADO
  return (
    <div className="dashboard-container">
      <div className="control-panel">
        {username && (
          <div className="user-info">
            <h2>Hola, {username}</h2>
            {userRole === "ROLE_ADMIN" && (
              <button className="admin-button" onClick={handleGoToAdmin}>
                Panel Admin
              </button>
            )}
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
