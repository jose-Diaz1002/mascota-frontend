import React from 'react';
import './PetCard.css';

const getPetFace = (hunger, sadness) => {
  if (sadness > 70) return '😢';
  if (hunger > 70) return '😴';
  if (sadness > 40) return '😐';
  if (hunger > 40) return '😮';
  return '😊';
};

// 1. Añadimos onDelete y onCustomize de nuevo a las props
function PetCard({ pet, onFeed, onCuddle, onDelete, onCustomize }) {
  const face = getPetFace(pet.hunger, pet.sadness);

  return (
    <div className="pet-card-info">
      <h3>{pet.name}</h3>
      <div className="status-bar">
        <label>Hambre: {pet.hunger}%</label>
        <progress value={pet.hunger} max="100"></progress>
      </div>
      <div className="status-bar">
        <label>Tristeza: {pet.sadness}%</label>
        <progress value={pet.sadness} max="100"></progress>
      </div>
      <div className="actions">
        <button onClick={() => onFeed(pet.id)}>Alimentar 🥪</button>
        <button onClick={() => onCuddle(pet.id)}>Mimar ❤️</button>
        <button onClick={onCustomize}>Personalizar ✨</button>
        {/* 2. Añadimos el botón de eliminar de nuevo */}
        <button onClick={() => onDelete(pet.id)} className="delete-btn">Liberar 🗑️</button>
      </div>
    </div>
  );
}

export default PetCard;