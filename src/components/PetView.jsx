// ARCHIVO: PetView.jsx
// PROPÓSITO: Muestra la visualización animada de la mascota
// Cambia la imagen y animación según el hambre y felicidad

"use client"
import { motion } from "framer-motion" // Librería para animaciones suaves
import "./PetView.css"

// IMPORTACIÓN DE IMÁGENES: Las 3 imágenes webp de tu mascota
// Estas rutas deben coincidir con donde guardaste tus archivos .webp
import petNormalImg from "../assets/pets/normal.webp" // Estado normal
import petHungryImg from "../assets/pets/hambriento.webp" // Estado hambriento
import petHappyImg from "../assets/pets/feliz.webp" // Estado feliz

// IMÁGENES DE ACCESORIOS: Sombreros y camisetas
const hatWizardImg = "/wizard-hat-accessory.jpg"
const shirtStripedImg = "/striped-shirt-accessory.jpg"

// MAPA DE ACCESORIOS: Organiza los accesorios por categoría
// Esto facilita agregar más accesorios en el futuro
const accessoryMap = {
  hat: { "sombrero-mago": hatWizardImg },
  shirt: { "camiseta-rayas": shirtStripedImg },
}

// FUNCIÓN: getPetImage
// PROPÓSITO: Decide qué imagen mostrar según las estadísticas
// LÓGICA:
// - Si está hovering → mascota feliz (sin importar las estadísticas)
// - Si hambre > 70 → mascota hambrienta
// - Si felicidad > 80 → mascota feliz
// - En cualquier otro caso → mascota normal
const getPetImage = (hunger, happiness, isHovering) => {
  console.log("[v0] getPetImage - hunger:", hunger, "happiness:", happiness, "isHovering:", isHovering)

  if (isHovering) {
    console.log("[v0] Mostrando imagen FELIZ por hover")
    return petHappyImg // Prioridad al hover
  }
  if (hunger > 70) {
    console.log("[v0] Mostrando imagen HAMBRIENTA")
    return petHungryImg // Prioridad al hambre
  }
  if (happiness > 80) {
    console.log("[v0] Mostrando imagen FELIZ por felicidad > 80")
    return petHappyImg
  }
  console.log("[v0] Mostrando imagen NORMAL")
  return petNormalImg // Imagen por defecto
}

// FUNCIÓN: getPetAnimation
// PROPÓSITO: Define la animación según el estado de la mascota
// RETORNA: Objeto con propiedades de animación para framer-motion
const getPetAnimation = (hunger, happiness) => {
  // ANIMACIÓN HAMBRIENTO: Salta arriba y abajo (pidiendo comida)
  if (hunger > 70) {
    return {
      y: [0, -10, 0], // Movimiento vertical: posición inicial → arriba → inicial
      transition: {
        duration: 2, // Duración de un ciclo completo (2 segundos)
        repeat: Number.POSITIVE_INFINITY, // Se repite infinitamente
      },
    }
  }

  // ANIMACIÓN FELIZ: Gira de lado a lado (celebrando)
  if (happiness > 80) {
    return {
      rotate: [0, -5, 5, -5, 0], // Rotación: centro → izq → der → izq → centro
      transition: {
        duration: 0.5, // Animación rápida (0.5 segundos)
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1, // Pausa de 1 segundo entre repeticiones
      },
    }
  }

  // ANIMACIÓN NORMAL: Flotación suave (respiración)
  return {
    y: [0, -5, 0], // Movimiento sutil arriba y abajo
    transition: {
      duration: 3, // Animación lenta (3 segundos)
      repeat: Number.POSITIVE_INFINITY,
    },
  }
}

// COMPONENTE PRINCIPAL: PetView
function PetView({ pet, isHovering, onMouseEnter, onMouseLeave }) {
  // Si no hay mascota, no renderiza nada
  if (!pet) return null

  // Obtiene la animación y la imagen según las estadísticas actuales
  const petAnimation = getPetAnimation(pet.hunger, pet.happiness)
  const petImageSrc = getPetImage(pet.hunger, pet.happiness, isHovering)

  return (
    <div className="pet-view-container">
      {/* motion.div: Componente de framer-motion que permite animaciones */}
      <motion.div
        className="pet-display"
        animate={petAnimation} // Aplica la animación calculada
        onMouseEnter={onMouseEnter} // Evento: ratón entra (acariciar)
        onMouseLeave={onMouseLeave} // Evento: ratón sale
        style={{ cursor: "pointer" }} // Cambia el cursor para indicar interactividad
      >
        {/* IMAGEN BASE: La mascota principal */}
        <img
          src={petImageSrc || "/placeholder.svg"} // Usa placeholder si no hay imagen
          alt="Mascota"
          className="pet-base"
          // Si no hay color guardado, no aplica ningún filtro (muestra el color original)
          style={{ filter: pet.color || "none" }}
        />

        {/* ACCESORIOS: Se renderizan encima de la mascota */}
        {/* RENDERIZADO CONDICIONAL: Solo muestra si pet.shirt existe */}
        {pet.shirt && (
          <img
            src={accessoryMap.shirt[pet.shirt] || "/placeholder.svg"}
            alt="Camiseta"
            className="pet-accessory shirt" // CSS posiciona esto sobre la mascota
          />
        )}

        {/* SOMBRERO: Similar a la camiseta */}
        {pet.hat && (
          <img src={accessoryMap.hat[pet.hat] || "/placeholder.svg"} alt="Sombrero" className="pet-accessory hat" />
        )}
      </motion.div>
    </div>
  )
}

export default PetView
