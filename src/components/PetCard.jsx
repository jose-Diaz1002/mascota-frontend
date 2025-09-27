import React from 'react';
import './PetCard.css';

const getPetFace = (hunger, sadness) => {
  if (sadness > 70) return '😢';
  if (hunger > 70) return '😴';
  if (sadness > 40) return '😐';
  if (hunger > 40) return '😮';
  return '😊';
};

function PetCard({ pet, onFeed, onCuddle, onCustomize }) { // Añade onCustomize
  // ...
  return (
    <div className="pet-card-info">
      <h3>{pet.name}</h3>
      {/* ... (tus barras de estado) ... */}
      <div className="actions">
        <button onClick={() => onFeed(pet.id)}>Alimentar 🥪</button>
        <button onClick={() => onCuddle(pet.id)}>Mimar ❤️</button>
        {/* --- BOTÓN NUEVO --- */}
        <button onClick={onCustomize}>Personalizar ✨</button>
      </div>
    </div>
  );
}

export default PetCard;