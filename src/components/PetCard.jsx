// ARCHIVO: PetCard.jsx
// PROPÓSITO: Muestra la información de la mascota (nombre, estadísticas) y botones de acción
// Es como una "tarjeta de información" de la mascota

"use client"

import { useState } from "react"
import "./PetCard.css"

// PROPS: Datos que recibe el componente desde su padre (PetDashboard)
// - pet: Objeto con toda la información de la mascota
// - onFeed: Función para alimentar a la mascota
// - onDelete: Función para eliminar la mascota
// - onColorChange: Función para cambiar el color de la mascota
function PetCard({ pet, onFeed, onDelete, onColorChange }) {
  // ESTADO: Controla si el panel de accesorios está visible
  const [showAccessoryPanel, setShowAccessoryPanel] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const colors = [
    { name: "Original", filter: "none" },
    { name: "Rojo", filter: "hue-rotate(30deg)" },
    { name: "Naranja", filter: "hue-rotate(60deg)" },
    { name: "Amarillo", filter: "hue-rotate(90deg)" },
    { name: "Verde", filter: "hue-rotate(120deg)" },
    { name: "Azul", filter: "hue-rotate(180deg)" },
    { name: "Morado", filter: "hue-rotate(270deg)" },
    { name: "Rosa", filter: "hue-rotate(330deg)" },
  ]

  // Si no hay mascota, no renderiza nada
  if (!pet) return null

  return (
    <>
      {/* TARJETA PRINCIPAL: Muestra información de la mascota */}
      <div className="pet-card">
        {/* NOMBRE: Título con el nombre de la mascota */}
        <h2>{pet.name}</h2>

        {/* ESTADÍSTICAS: Barras de hambre y felicidad */}
        <div className="stats">
          {/* BARRA DE HAMBRE */}
          <div className="stat">
            <label>Hambre</label>
            {/* Barra de progreso visual */}
            <div className="stat-bar">
              {/* El ancho de la barra se ajusta según el porcentaje de hambre */}
              {/* style inline: Permite aplicar estilos dinámicos basados en datos */}
              <div className="stat-fill hunger" style={{ width: `${pet.hunger}%` }}></div>
            </div>
            {/* Muestra el valor numérico */}
            <span>{pet.hunger}%</span>
          </div>

          {/* BARRA DE FELICIDAD */}
          <div className="stat">
            <label>Mimos</label>
            <div className="stat-bar">
              <div className="stat-fill happiness" style={{ width: `${pet.happiness}%` }}></div>
            </div>
            <span>{pet.happiness}%</span>
          </div>
        </div>

        {/* BOTONES DE ACCIÓN: Permiten interactuar con la mascota */}
        <div className="actions">
          {/* BOTÓN ALIMENTAR: Reduce el hambre */}
          <button className="action-button feed" onClick={onFeed}>
            Alimentar
          </button>

          {/* BOTÓN PERSONALIZAR: Abre el panel de accesorios */}
          <button className="action-button customize" onClick={() => setShowColorPicker(!showColorPicker)}>
            Cambiar Color
          </button>

          {/* BOTÓN ELIMINAR: Borra la mascota */}
          {/* onClick con arrow function: Pasa el ID de la mascota a la función */}
          <button className="action-button delete" onClick={() => onDelete(pet.id)}>
            Eliminar
          </button>
        </div>

        {showColorPicker && (
          <div className="color-picker">
            <h4>Elige un color:</h4>
            <div className="color-options">
              {colors.map((color, index) => (
                <button
                  key={index}
                  className="color-option"
                  style={{
                    filter: color.filter,
                    backgroundColor: "#ff69b4",
                  }}
                  onClick={() => {
                    onColorChange(color.filter)
                    setShowColorPicker(false)
                  }}
                  title={color.name}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PANEL DE ACCESORIOS: Modal que aparece cuando showAccessoryPanel es true */}
      {/* RENDERIZADO CONDICIONAL: Solo se renderiza si showAccessoryPanel es true */}
      {/* No se necesita el AccessoryPanel con el nuevo botón de color */}
      {/* {showAccessoryPanel && (
        <AccessoryPanel
          pet={pet}
          onClose={() => setShowAccessoryPanel(false)} // Cierra el panel
          onUpdate={onUpdate} // Actualiza la mascota con los nuevos accesorios
        />
      )} */}
    </>
  )
}

export default PetCard
