import React from 'react';
import { motion } from 'framer-motion';
import './PetView.css';

// --- 1. IMPORTA LAS IMÁGENES COMPLETAS ---
import petHappyImg from '../assets/pets/mascota-feliz.png';
import petSadImg from '../assets/pets/mascota-triste.png';
import petHungryImg from '../assets/pets/mascota-hambrienta.png';
import petNeutralImg from '../assets/pets/mascota-neutral.png';

// Importa los accesorios
import hatWizardImg from '../assets/accessories/sombrero-mago.png';
import shirtStripedImg from '../assets/accessories/camiseta-rayas.png';

const accessoryMap = {
  hat: { 'sombrero-mago': hatWizardImg },
  shirt: { 'camiseta-rayas': shirtStripedImg },
};

// --- 2. LA FUNCIÓN AHORA DEVUELVE LA IMAGEN COMPLETA CORRECTA ---
const getPetImage = (hunger, happiness) => {
  if (hunger > 70) return petHungryImg;
  if (happiness < 30) return petSadImg;
  if (happiness < 60) return petNeutralImg;
  return petHappyImg;
};

// (La función de animación se queda igual)
const getPetAnimation = (hunger, happiness) => { /*...*/ };

function PetView({ pet }) {
  if (!pet) return null;

  const petAnimation = getPetAnimation(pet.hunger, pet.happiness);
  const petImageSrc = getPetImage(pet.hunger, pet.happiness); // Obtenemos la imagen correcta

  return (
    <div className="pet-view-container">
      <motion.div className="pet-display" animate={petAnimation}>
        
        {/* --- 3. MOSTRAMOS LA IMAGEN COMPLETA QUE CORRESPONDE --- */}
        <img src={petImageSrc} alt="Mascota" className="pet-base" style={{ filter: `hue-rotate(${pet.color || 0}deg)` }}/>
        
        {/* Los accesorios se superponen sobre la imagen completa */}
        {pet.shirt && <img src={accessoryMap.shirt[pet.shirt]} alt="Camiseta" className="pet-accessory shirt" />}
        {pet.hat && <img src={accessoryMap.hat[pet.hat]} alt="Sombrero" className="pet-accessory hat" />}

      </motion.div>
    </div>
  );
}

export default PetView;