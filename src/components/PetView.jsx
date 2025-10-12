"use client"
import { motion } from "framer-motion"
import "./PetView.css"

// --- 1. IMPORTA TUS NUEVOS GIFs ---
// (Asegúrate de que los nombres de archivo coincidan con los que guardaste)
import petNormalImg from '../assets/pets/normal.webp';
import petHungryImg from '../assets/pets/hambriento.webp';
import petHappyImg from '../assets/pets/feliz.webp';

const hatWizardImg = "/wizard-hat-accessory.jpg"
const shirtStripedImg = "/striped-shirt-accessory.jpg"

const accessoryMap = {
  hat: { "sombrero-mago": hatWizardImg },
  shirt: { "camiseta-rayas": shirtStripedImg },
}

const getPetImage = (hunger, happiness) => {
  if (hunger > 70) return petHungryImg
  if (happiness > 80) return petHappyImg
  return petNormalImg
}

const getPetAnimation = (hunger, happiness) => {
  if (hunger > 70) {
    return { y: [0, -10, 0], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY } }
  }
  if (happiness > 80) {
    return {
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 },
    }
  }
  return { y: [0, -5, 0], transition: { duration: 3, repeat: Number.POSITIVE_INFINITY } }
}

function PetView({ pet, onMouseEnter, onMouseLeave }) {
  if (!pet) return null

  const petAnimation = getPetAnimation(pet.hunger, pet.happiness)
  const petImageSrc = getPetImage(pet.hunger, pet.happiness)

  return (
    <div className="pet-view-container">
      <motion.div
        className="pet-display"
        animate={petAnimation}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ cursor: "pointer" }}
      >
        <img
          src={petImageSrc || "/placeholder.svg"}
          alt="Mascota"
          className="pet-base"
          style={{ filter: `hue-rotate(${pet.color || 0}deg)` }}
        />

        {pet.shirt && (
          <img
            src={accessoryMap.shirt[pet.shirt] || "/placeholder.svg"}
            alt="Camiseta"
            className="pet-accessory shirt"
          />
        )}
        {pet.hat && (
          <img src={accessoryMap.hat[pet.hat] || "/placeholder.svg"} alt="Sombrero" className="pet-accessory hat" />
        )}
      </motion.div>
    </div>
  )
}

export default PetView
