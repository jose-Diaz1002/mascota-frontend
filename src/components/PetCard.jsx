// src/components/PetCard.jsx
import React from 'react';
import './PetCard.css';

// Esta función determinará qué cara mostrar
const getPetFace = (hunger, sadness) => {
  if (sadness > 70) return '😢'; // Muy triste
  if (hunger > 70) return '😴'; // Bostezando de hambre
  if (sadness > 40) return '😐'; // Un poco triste
  if (hunger > 40) return '😮'; // Un poco hambriento
  return '😊'; // Feliz
};

function PetCard({ pet, onFeed, onCuddle, onDelete }) {
  const face = getPetFace(pet.hunger, pet.sadness);

  return (
    <div className="pet-card">
      <div className="pet-visual">
        <div className="pet-face" style={{ color: pet.color || '#000' }}>
          {face}
        </div>
        <div className="pet-body" style={{ backgroundColor: pet.color || '#ccc' }}></div>
      </div>
      <div className="pet-info">
        <h3>{pet.name}</h3>
        <p>"{pet.specialFeatures}"</p>
        
        {/* Barras de estado */}
        <div className="status-bar">
          <label>Hambre: {pet.hunger}%</label>
          <progress value={pet.hunger} max="100"></progress>
        </div>
        <div className="status-bar">
          <label>Tristeza: {pet.sadness}%</label>
          <progress value={pet.sadness} max="100"></progress>
        </div>

        {/* Botones de acción */}
        <div className="actions">
          <button onClick={() => onFeed(pet.id)}>Alimentar 🥪</button>
          <button onClick={() => onCuddle(pet.id)}>Mimar ❤️</button>
          <button onClick={() => onDelete(pet.id)} className="delete-btn">Liberar</button>
        </div>
      </div>
    </div>
  );
}

export default PetCard;