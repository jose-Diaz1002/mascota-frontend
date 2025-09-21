// src/components/PetDashboard.jsx

// --- Importaciones ---
// Importamos las librerías necesarias: React para el componente y sus hooks,
// axios para las llamadas a la API, y el archivo CSS para los estilos.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PetDashboard.css'; 
// Importamos la imagen del dragón desde la carpeta de assets.
import dragonImage from '../assets/dragon.png';

function PetDashboard() {
  // --- Estados del Componente ---
  // useState nos permite guardar información que cambia y que refresca la vista.
  const [pets, setPets] = useState([]); // Almacena la lista de mascotas del usuario.
  const [loading, setLoading] = useState(true); // Indica si estamos esperando una respuesta de la API.
  const [error, setError] = useState(''); // Guarda cualquier mensaje de error para mostrarlo al usuario.
  
  // Estados para el formulario de creación de mascotas.
  const [newName, setNewName] = useState('');
  const [newCreatureType, setNewCreatureType] = useState('Dragón');
  const [newColor, setNewColor] = useState('');

  // Estado para controlar qué mascota se está editando.
  // Si es 'null', no hay ninguna en modo edición. Si contiene un objeto mascota, se mostrará el formulario de edición.
  const [editingPet, setEditingPet] = useState(null);

  // --- Lógica de Datos (API) ---

  // useEffect se ejecuta cuando el componente se "monta" (aparece por primera vez).
  // El array vacío `[]` al final asegura que solo se ejecute una vez.
  useEffect(() => {
    fetchPets();
  }, []);

  // Función para obtener todas las mascotas del usuario desde el backend.
  const fetchPets = async () => {
    try {
      setLoading(true); // Empezamos a cargar
      const token = localStorage.getItem('token'); // Recuperamos el token guardado en el login
      const response = await axios.get('http://localhost:8080/api/pets', {
        headers: { Authorization: `Bearer ${token}` } // Enviamos el token para la autorización
      });
      setPets(response.data); // Guardamos las mascotas en el estado
    } catch (err) {
      console.error("Error al obtener las mascotas:", err);
      setError('No se pudieron cargar las mascotas. Por favor, recarga la página.');
    } finally {
      setLoading(false); // Terminamos de cargar, ya sea con éxito o error
    }
  };

  // --- Manejadores de Eventos (Handlers) ---

  // Se ejecuta al enviar el formulario de creación.
  const handleCreatePet = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    try {
      const token = localStorage.getItem('token');
      const newPet = { name: newName, creatureType: newCreatureType, color: newColor };
      await axios.post('http://localhost:8080/api/pets', newPet, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Limpiamos los campos y recargamos la lista de mascotas para ver la nueva
      setNewName(''); 
      setNewColor(''); 
      setNewCreatureType('Dragón');
      fetchPets();
    } catch (err) {
      console.error("Error al crear la mascota:", err);
      setError('No se pudo crear la mascota.');
    }
  };
  
  // Se ejecuta al enviar el formulario de edición.
  const handleUpdatePet = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const updatedPetData = { name: editingPet.name, creatureType: editingPet.creatureType, color: editingPet.color };
        await axios.put(`http://localhost:8080/api/pets/${editingPet.id}`, updatedPetData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingPet(null); // Salimos del modo edición
        fetchPets(); // Recargamos la lista para ver los cambios
    } catch (err) {
        console.error("Error al actualizar la mascota:", err);
        setError('No se pudo actualizar la mascota.');
    }
  };

  // Se ejecuta al hacer clic en el botón "Eliminar".
  const handleDeletePet = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPets(); // Recargamos la lista
      } catch (err) {
        console.error("Error al eliminar la mascota:", err);
        setError('No se pudo eliminar la mascota.');
      }
    }
  };

  // Se ejecuta al hacer clic en "Cerrar Sesión".
  const handleLogout = () => {
    localStorage.removeItem('token'); // Borramos el token
    window.location.href = '/login'; // Redirigimos al login
  };

  // --- Renderizado del Componente (lo que se ve en pantalla) ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Guardería de Mascotas</h1>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>
      
      <div className="create-pet-form">
        <h3>Añadir Nueva Criatura</h3>
        <form onSubmit={handleCreatePet} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre"/>
          <select value={newCreatureType} onChange={e => setNewCreatureType(e.target.value)}>
            <option>Dragón</option>
            <option>Unicornio</option>
            <option>Extraterrestre</option>
          </select>
          <input value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="Color"/>
          <button type="submit">Crear Mascota</button>
        </form>
      </div>

      <h2>Tus Criaturas</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      
      {/* Mostramos un mensaje de carga mientras 'loading' sea true */}
      {loading ? <p>Cargando...</p> : (
        <ul className="pet-list">
          {pets.length === 0 && <p>No tienes ninguna mascota todavía. ¡Crea una!</p>}
          
          {/* Usamos .map para crear un elemento <li> por cada mascota en el estado */}
          {pets.map(pet => (
            <li key={pet.id} className="pet-item">
              
              {/* Si la mascota que estamos mostrando es la que se está editando... */}
              {editingPet && editingPet.id === pet.id ? (
                // ...mostramos el formulario de edición.
                <form onSubmit={handleUpdatePet} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <img src={dragon} alt="pet" className="pet-image"/>
                  <input value={editingPet.name} onChange={e => setEditingPet({...editingPet, name: e.target.value})} />
                  <select value={editingPet.creatureType} onChange={e => setEditingPet({...editingPet, creatureType: e.target.value})}>
                    <option>Dragón</option><option>Unicornio</option><option>Extraterrestre</option>
                  </select>
                  <input value={editingPet.color} onChange={e => setEditingPet({...editingPet, color: e.target.value})} />
                  <div style={{ marginLeft: 'auto' }}>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => setEditingPet(null)}>Cancelar</button>
                  </div>
                </form>
              ) : (
                // ...si no, mostramos la vista normal.
                <>
                  <img src={pet.creatureType === 'Dragón' ? dragonImage : undefined} alt={pet.creatureType} className="pet-image"/>
                  <div style={{ flexGrow: 1 }}>
                    <strong>{pet.name}</strong> ({pet.creatureType} {pet.color})
                  </div>
                  <div>
                    <button onClick={() => setEditingPet(pet)}>Editar</button>
                    <button onClick={() => handleDeletePet(pet.id)}>Eliminar</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PetDashboard;