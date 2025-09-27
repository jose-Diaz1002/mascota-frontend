// src/components/AccessoryPanel.jsx
import React from 'react';
import './AccessoryPanel.css';

// Lista de sombreros disponibles. En una app más grande, esto vendría de una API.
const availableHats = [
  { id: 'ninguno', name: 'Ninguno' },
  { id: 'gorra', name: 'Gorra' },
  { id: 'sombrero-mago', name: 'Sombrero de Mago' },
  { id: 'corona', name: 'Corona' },
];

// src/components/AccessoryPanel.jsx

// ... (resto del código del panel)

function AccessoryPanel({ pet, onEquipAccessory, onClose }) {
  return (
    <div className="accessory-panel-overlay">
      <div className="accessory-panel">
        {/* ESTE BOTÓN AHORA LLAMARÁ A LA FUNCIÓN onClose */}
        <button onClick={onClose} className="close-btn">&times;</button>
        <h3>Elige un sombrero para {pet.name}</h3>
        {/* ... (el resto del panel se queda igual) ... */}
      </div>
    </div>
  );
}

export default AccessoryPanel;