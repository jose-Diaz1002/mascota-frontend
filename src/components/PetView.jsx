import React from 'react';
import './PetView.css';

// Importa las imágenes que acabas de guardar
import petBaseImg from '../assets/accessories/mascota-base.png';
import hatWizardImg from '../assets/accessories/sombrero-mago.png';
import shirtStripedImg from '../assets/accessories/camiseta-rayas.png';

// Un mapa para asociar el nombre del accesorio con su imagen importada
const accessoryMap = {
  hat: {
    'sombrero-mago': hatWizardImg,
  },
  shirt: {
    'camiseta-rayas': shirtStripedImg,
  },
};

function PetView({ pet }) {
  if (!pet) return null; // No mostrar nada si no hay una mascota seleccionada

  return (
    <div className="pet-view-container">
      {/* Mostramos la imagen de fondo si existe */}
      {/* <img src={...} className="background-image" /> */}

      <div className="pet-display">
        {/* 1. La imagen base de la mascota */}
        <img src={petBaseImg} alt="Mascota" className="pet-base" style={{ filter: `hue-rotate(${pet.color || 0}deg)` }}/>

        {/* 2. Superponemos la camiseta si tiene una equipada */}
        {pet.shirt && <img src={accessoryMap.shirt[pet.shirt]} alt="Camiseta" className="pet-accessory shirt" />}

        {/* 3. Superponemos el sombrero si tiene uno equipado */}
        {pet.hat && <img src={accessoryMap.hat[pet.hat]} alt="Sombrero" className="pet-accessory hat" />}
      </div>
    </div>
  );
}

export default PetView;