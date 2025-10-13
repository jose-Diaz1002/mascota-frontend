// ARCHIVO: PetDashboard.jsx
// PROPÓSITO: Panel principal de la aplicación donde se gestionan las mascotas
// Muestra la lista de mascotas, permite crear nuevas, y visualizar/interactuar con ellas

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
  const [selectedPet, setSelectedPet] = useState(null) // Mascota actualmente seleccionada
  const [showCreateForm, setShowCreateForm] = useState(false) // Controla si se muestra el formulario de creación
  const [newPetName, setNewPetName] = useState("") // Nombre de la nueva mascota
  const [error, setError] = useState("") // Mensajes de error
  const [username, setUsername] = useState("") // Nombre del usuario logueado
  const [userRole, setUserRole] = useState("")
  const [isHovering, setIsHovering] = useState(false) // Nuevo estado para controlar cuando el ratón está sobre la mascota
  const navigate = useNavigate()

  // EFECTO 1: Se ejecuta UNA VEZ cuando el componente se monta (carga inicial)
  // useEffect con array vacío [] se ejecuta solo al inicio
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
  }, []) // Array vacío = solo se ejecuta una vez

  // EFECTO 2: Controla la FELICIDAD de la mascota
  // Se ejecuta cada vez que cambia selectedPet
  // La felicidad DISMINUYE automáticamente cada 1 segundo
  useEffect(() => {
    if (!selectedPet) return // Si no hay mascota seleccionada, no hace nada

    // setInterval: Ejecuta una función cada X milisegundos
    const happinessInterval = setInterval(() => {
      // setSelectedPet con función: Recibe el estado anterior y devuelve el nuevo
      setSelectedPet((prev) => {
        if (!prev) return prev

        // Math.max(0, valor) asegura que nunca sea menor que 0
        const newHappiness = Math.max(0, prev.happiness - 1) // Disminuye 1 punto

        // Actualiza en el backend
        updatePetStats(prev.id, { happiness: newHappiness })

        // Devuelve el nuevo estado con la felicidad actualizada
        return { ...prev, happiness: newHappiness } // Spread operator (...) copia todas las propiedades
      })
    }, 1000) // 1000ms = 1 segundo (MÁS RÁPIDO que antes)

    // CLEANUP: clearInterval detiene el intervalo cuando el componente se desmonta
    // o cuando selectedPet cambia (para evitar múltiples intervalos)
    return () => clearInterval(happinessInterval)
  }, [selectedPet]) // Se ejecuta cada vez que selectedPet cambia

  // EFECTO 3: Controla el HAMBRE de la mascota
  // El hambre AUMENTA automáticamente cada 3 segundos
  useEffect(() => {
    if (!selectedPet) return

    const hungerInterval = setInterval(() => {
      setSelectedPet((prev) => {
        if (!prev) return prev

        // Math.min(100, valor) asegura que nunca sea mayor que 100
        const newHunger = Math.min(100, prev.hunger + 2) // Aumenta 2 puntos

        updatePetStats(prev.id, { hunger: newHunger })
        return { ...prev, hunger: newHunger }
      })
    }, 3000) // 3000ms = 3 segundos (MÁS RÁPIDO que antes)

    return () => clearInterval(hungerInterval)
  }, [selectedPet])

  // EFECTO 4: Controla el aumento de FELICIDAD mientras el ratón está sobre la mascota
  // La felicidad AUMENTA continuamente cada 500ms mientras isHovering es true
  useEffect(() => {
    if (!selectedPet || !isHovering) return // Solo funciona si hay mascota Y el ratón está encima

    // Intervalo que se ejecuta cada 500ms mientras se acaricia
    const hoverInterval = setInterval(() => {
      setSelectedPet((prev) => {
        if (!prev) return prev

        // Aumenta la felicidad en 2 puntos (hasta máximo 100)
        const newHappiness = Math.min(100, prev.happiness + 2)

        // Actualiza en el backend
        updatePetStats(prev.id, { happiness: newHappiness })

        return { ...prev, happiness: newHappiness }
      })
    }, 500) // 500ms = medio segundo (aumenta rápido mientras acaricia)

    // Limpia el intervalo cuando deja de acariciar o cambia de mascota
    return () => clearInterval(hoverInterval)
  }, [selectedPet, isHovering]) // Se ejecuta cuando cambia selectedPet O isHovering

  // FUNCIÓN: fetchPets
  // PROPÓSITO: Obtiene todas las mascotas del usuario desde el backend
  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token") // Obtiene el token de autenticación

      // GET request al backend con el token en los headers
      // El token es necesario para que el backend sepa qué usuario está haciendo la petición
      const response = await axios.get("http://localhost:8080/api/pets", {
        headers: { Authorization: `Bearer ${token}` }, // Bearer token es el estándar para JWT
      })

      setPets(response.data) // Guarda las mascotas en el estado

      // Si hay mascotas, selecciona automáticamente la primera
      if (response.data.length > 0) {
        setSelectedPet(response.data[0])
      }
    } catch (err) {
      console.error("Error al obtener mascotas:", err)

      // Si el token es inválido o expiró (error 401), redirige al login
      if (err.response?.status === 401) {
        navigate("/login")
      }
    }
  }

  // FUNCIÓN: updatePetStats
  // PROPÓSITO: Actualiza las estadísticas de una mascota en el backend
  // Se usa para sincronizar los cambios locales con la base de datos
  const updatePetStats = async (petId, stats) => {
    try {
      const token = localStorage.getItem("token")

      // PUT request para actualizar la mascota
      await axios.put(`http://localhost:8080/api/pets/${petId}`, stats, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (err) {
      console.error("Error al actualizar estadísticas:", err)
    }
  }

  // FUNCIÓN: handleCreatePet
  // PROPÓSITO: Crea una nueva mascota cuando el usuario envía el formulario
  const handleCreatePet = async (event) => {
    event.preventDefault() // Previene recarga de página
    setError("")

    // Validación: El nombre no puede estar vacío
    if (!newPetName.trim()) {
      setError("El nombre de la mascota es obligatorio.")
      return
    }

    try {
      const token = localStorage.getItem("token")

      // POST request para crear una nueva mascota
      const response = await axios.post(
        "http://localhost:8080/api/pets",
        {
          name: newPetName,
          hunger: 50, // Valores iniciales
          happiness: 50,
          color: 0, // Color por defecto
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Actualiza el estado local con la nueva mascota
      setPets([...pets, response.data]) // Spread operator añade la nueva mascota al array
      setSelectedPet(response.data) // Selecciona automáticamente la nueva mascota

      // Limpia el formulario
      setNewPetName("")
      setShowCreateForm(false)
    } catch (err) {
      console.error("Error al crear mascota:", err)
      setError("No se pudo crear la mascota. Inténtalo de nuevo.")
    }
  }

  // FUNCIÓN: handleFeed
  // PROPÓSITO: Alimenta a la mascota, reduciendo su hambre en 20 puntos
  const handleFeed = async () => {
    if (!selectedPet) return

    const newHunger = Math.max(0, selectedPet.hunger - 20) // Reduce hambre
    setSelectedPet({ ...selectedPet, hunger: newHunger }) // Actualiza estado local
    await updatePetStats(selectedPet.id, { hunger: newHunger }) // Sincroniza con backend
  }

  // FUNCIÓN: handleMouseEnter
  // PROPÓSITO: Se ejecuta cuando el ratón entra en la mascota (acariciar)
  // Aumenta la felicidad en 5 puntos
  const handleMouseEnter = () => {
    if (!selectedPet) return

    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // FUNCIÓN: handleColorChange
  // PROPÓSITO: Cambia el color de la mascota aplicando un filtro CSS
  // PARÁMETRO: colorValue - String con el filtro CSS completo (ej: "grayscale(100%) sepia(100%) hue-rotate(160deg)")
  const handleColorChange = async (colorValue) => {
    if (!selectedPet) return

    setSelectedPet({ ...selectedPet, color: colorValue })
    await updatePetStats(selectedPet.id, { color: colorValue })
  }

  // FUNCIÓN: handleDelete
  // PROPÓSITO: Elimina una mascota después de confirmar con el usuario
  const handleDelete = async (petId) => {
    // window.confirm muestra un diálogo de confirmación
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return

    try {
      const token = localStorage.getItem("token")

      // DELETE request para eliminar la mascota
      await axios.delete(`http://localhost:8080/api/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Actualiza el estado local removiendo la mascota eliminada
      const updatedPets = pets.filter((p) => p.id !== petId) // filter crea un nuevo array sin la mascota
      setPets(updatedPets)

      // Si quedan mascotas, selecciona la primera; si no, null
      setSelectedPet(updatedPets.length > 0 ? updatedPets[0] : null)
    } catch (err) {
      console.error("Error al eliminar mascota:", err)
    }
  }

  // FUNCIÓN: handleLogout
  // PROPÓSITO: Cierra la sesión del usuario
  // Elimina todos los datos de localStorage y redirige al login
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("username")
    navigate("/login")
  }

  const handleGoToAdmin = () => {
    navigate("/admin")
  }

  // RENDERIZADO: JSX que define la estructura visual del componente
  return (
    <div className="dashboard-container">
      {/* PANEL IZQUIERDO: Control panel con opciones */}
      <div className="control-panel">
        {/* Muestra el nombre del usuario si existe */}
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

        {/* RENDERIZADO CONDICIONAL: Muestra PetCard si hay mascota seleccionada, o formulario de creación */}
        {selectedPet ? (
          // Si hay mascota seleccionada, muestra el PetCard con sus estadísticas y botones
          <PetCard pet={selectedPet} onFeed={handleFeed} onDelete={handleDelete} onColorChange={handleColorChange} />
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

        {/* BOTÓN DE LOGOUT: Siempre visible en la parte inferior */}
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      {/* ÁREA DERECHA: Visualización de la mascota */}
      <div className="pet-view-area">
        {/* RENDERIZADO CONDICIONAL: Muestra mascota O mensaje */}
        {selectedPet ? (
          <PetView
            pet={selectedPet}
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
