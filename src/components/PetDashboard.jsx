import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PetDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para el formulario de creación
  const [newName, setNewName] = useState('');
  const [newCreatureType, setNewCreatureType] = useState('Dragón');
  const [newColor, setNewColor] = useState('');

  // Estados para la edición
  const [editingPet, setEditingPet] = useState(null); // Guarda el objeto mascota que se está editando

  // --- Funciones de API ---
  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data);
    } catch (err) {
      handleApiError(err, 'No se pudieron cargar las mascotas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newPet = { name: newName, creatureType: newCreatureType, color: newColor };
      await axios.post('http://localhost:8080/api/pets', newPet, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName(''); setNewColor(''); setNewCreatureType('Dragón');
      fetchPets(); // Recargar lista
    } catch (err) {
      handleApiError(err, 'No se pudo crear la mascota.');
    }
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPets(); // Recargar lista
      } catch (err) {
        handleApiError(err, 'No se pudo eliminar la mascota.');
      }
    }
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const updatedPetData = { name: editingPet.name, creatureType: editingPet.creatureType, color: editingPet.color };
        await axios.put(`http://localhost:8080/api/pets/${editingPet.id}`, updatedPetData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingPet(null); // Salir del modo edición
        fetchPets(); // Recargar lista
    } catch (err) {
        handleApiError(err, 'No se pudo actualizar la mascota.');
    }
  };
  
  const handleApiError = (err, defaultMessage) => {
      console.error(err);
      if (err.response && err.response.status === 403) {
          setError("Acción no permitida.");
      } else {
          setError(defaultMessage);
      }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // --- Renderizado del Componente ---
  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guardería de Mascotas</h1>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      <hr />
      
      {/* Formulario de Creación */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Añadir Nueva Criatura</h3>
        <form onSubmit={handleCreatePet}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre"/>
          <select value={newCreatureType} onChange={e => setNewCreatureType(e.target.value)}>
            <option>Dragón</option><option>Unicornio</option><option>Extraterrestre</option>
          </select>
          <input value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="Color"/>
          <button type="submit">Crear Mascota</button>
        </form>
      </div>

      <h2>Tus Criaturas</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {loading ? <p>Cargando...</p> : pets.map(pet => (
        <div key={pet.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          {editingPet && editingPet.id === pet.id ? (
            // --- VISTA DE EDICIÓN ---
            <form onSubmit={handleUpdatePet}>
              <input value={editingPet.name} onChange={e => setEditingPet({...editingPet, name: e.target.value})} />
              <select value={editingPet.creatureType} onChange={e => setEditingPet({...editingPet, creatureType: e.target.value})}>
                <option>Dragón</option><option>Unicornio</option><option>Extraterrestre</option>
              </select>
              <input value={editingPet.color} onChange={e => setEditingPet({...editingPet, color: e.target.value})} />
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditingPet(null)}>Cancelar</button>
            </form>
          ) : (
            // --- VISTA NORMAL ---
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{pet.name}</strong> ({pet.creatureType} {pet.color})
              </div>
              <div>
                <button onClick={() => setEditingPet(pet)}>Editar</button>
                <button onClick={() => handleDeletePet(pet.id)}>Eliminar</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PetDashboard;