"use client"
import "./PetCard.css"

// Función que determina el emoji de la mascota según su estado
const getPetFace = (hunger, happiness) => {
  if (happiness < 30) return "😢"  // Si felicidad es menor a 30, muestra cara triste
  if (hunger > 70) return "😴"     // Si hambre es mayor a 70, muestra cara cansada
  if (happiness < 60) return "😐"  // Si felicidad es menor a 60, muestra cara neutral
  return "😊"                      // En otros casos, muestra cara feliz
}

// Componente que muestra la tarjeta de información de la mascota
function PetCard({ pet, onFeed, onCuddle, onCustomize, onDelete }) {
  const face = getPetFace(pet.hunger, pet.happiness)  // Obtiene el emoji actual

  return (
    <div className="pet-card-info">
      <h3>{pet.name}</h3>  {/* Muestra el nombre de la mascota */}

      {/* Barra de progreso para el hambre */}
      <div className="status-bar">
        <label>Hambre: {pet.hunger}%</label>
        <progress value={pet.hunger} max="100"></progress>
      </div>

      {/* Barra de progreso para la felicidad */}
      <div className="status-bar">
        <label>Felicidad: {pet.happiness}%</label>
        <progress value={pet.happiness} max="100" className="happiness-bar"></progress>
      </div>

      {/* Contenedor de botones de acciones */}
      <div className="actions">
        {/* Botón para alimentar a la mascota */}
        <button onClick={() => onFeed(pet.id)}>Alimentar 🥪</button>
        
        {/* Botón para acariciar a la mascota */}
        <button onClick={() => onCuddle(pet.id)}>Acariciar 🫳</button>
        
        {/* Botón para personalizar la mascota */}
        <button onClick={() => onCustomize(pet.id)}>Personalizar 🎨</button>
        
        {/* Botón para eliminar/cambiar mascota - solo se muestra si onDelete existe */}
        {onDelete && (
          <button onClick={() => onDelete(pet.id)} className="delete-btn">
            Cambiar
          </button>
        )}
      </div>
    </div>
  )
}

export default PetCard