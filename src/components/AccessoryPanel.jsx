"use client"
import "./AccessoryPanel.css"

const availableHats = [
  { id: "ninguno", name: "Ninguno" },
  { id: "gorra", name: "Gorra" },
  { id: "sombrero-mago", name: "Sombrero de Mago" },
  { id: "corona", name: "Corona" },
]

const availableShirts = [
  { id: "ninguno", name: "Ninguno" },
  { id: "camiseta-rayas", name: "Camiseta de Rayas" },
]

function AccessoryPanel({ pet, onEquipAccessory, onClose }) {
  return (
    <div className="accessory-panel-overlay">
      <div className="accessory-panel">
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
        <h3>Personaliza a {pet.name}</h3>

        <div className="accessory-section">
          <h4>Sombreros</h4>
          <div className="accessory-grid">
            {availableHats.map((hat) => (
              <div
                key={hat.id}
                className={`accessory-item ${pet.hat === hat.id ? "equipped" : ""}`}
                onClick={() => onEquipAccessory(pet.id, "hat", hat.id === "ninguno" ? "" : hat.id)}
              >
                <span>{hat.name}</span>
                {pet.hat === hat.id && <span className="equipped-badge">✓ Equipado</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="accessory-section">
          <h4>Camisetas</h4>
          <div className="accessory-grid">
            {availableShirts.map((shirt) => (
              <div
                key={shirt.id}
                className={`accessory-item ${pet.shirt === shirt.id ? "equipped" : ""}`}
                onClick={() => onEquipAccessory(pet.id, "shirt", shirt.id === "ninguno" ? "" : shirt.id)}
              >
                <span>{shirt.name}</span>
                {pet.shirt === shirt.id && <span className="equipped-badge">✓ Equipado</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessoryPanel
