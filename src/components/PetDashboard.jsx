import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PetDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newCreatureType, setNewCreatureType] = useState('Dragón');
  const [newColor, setNewColor] = useState('');

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/pets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data);
    } catch (err) {
      console.error("Error al obtener las mascotas:", err);
      setError('No se pudieron cargar las mascotas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e) => {
    e.preventDefault();
    if (!newName || !newColor) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const newPet = { name: newName, creatureType: newCreatureType, color: newColor };
      await axios.post('http://localhost:8080/api/pets', newPet, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName('');
      setNewColor('');
      fetchPets();
    } catch (err) {
      console.error("Error al crear la mascota:", err);
      setError('No se pudo crear la mascota.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Guardería de Mascotas</h1>
        <button onClick={handleLogout} style={{ padding: '10px' }}>Cerrar Sesión</button>
      </div>
      <hr />
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Crear una nueva criatura</h3>
        <form onSubmit={handleCreatePet} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre" style={{ padding: '8px' }} />
          <select value={newCreatureType} onChange={e => setNewCreatureType(e.target.value)} style={{ padding: '8px' }}>
            <option>Dragón</option>
            <option>Unicornio</option>
            <option>Extraterrestre</option>
          </select>
          <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="Color (ej: rojo)" style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '8px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Crear</button>
        </form>
      </div>
      <h2>Tus Criaturas</h2>
      {loading ? <p>Cargando...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
        pets.length === 0 ? (
          <p>No tienes ninguna mascota todavía. ¡Crea una!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {pets.map(pet => (
              <li key={pet.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px', background: 'white' }}>
                <strong>Nombre:</strong> {pet.name} <br />
                <strong>Tipo:</strong> {pet.creatureType} <br />
                <strong>Color:</strong> {pet.color} <br />
                <strong>Ánimo:</strong> {pet.mood} | <strong>Energía:</strong> {pet.energyLevel}
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export default PetDashboard;