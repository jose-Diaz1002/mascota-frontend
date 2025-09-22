import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from './PetCard.jsx';
import './PetDashboard.css';

function PetDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el formulario de creación
  const [name, setName] = useState('');
  const [color, setColor] = useState('#a9e4ff'); // Un color inicial más bonito
  const [features, setFeatures] = useState('');

  const fetchPets = async () => {
    // ... (Esta función se queda exactamente igual que en el mensaje anterior)
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const endpoint = role === 'ROLE_ADMIN' ? '/api/pets/all' : '/api/pets';

      const response = await axios.get(`http://localhost:8080${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data);
    } catch (error) {
      console.error("Error al cargar las mascotas", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleCreatePet = async (e) => {
    // ... (Esta función se queda exactamente igual)
    e.preventDefault();
    if (!name || !features) {
      alert("El nombre y las características no pueden estar vacíos.");
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/pets', { name, color, specialFeatures: features }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setColor('#a9e4ff');
      setFeatures('');
      fetchPets();
    } catch (error) {
      console.error("Error al crear la mascota", error);
    }
  };

  const updatePetState = (updatedPet) => {
    setPets(currentPets => currentPets.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const handleFeed = async (petId) => {
    // ... (Esta función se queda exactamente igual)
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:8080/api/pets/${petId}/feed`, {}, { headers: { Authorization: `Bearer ${token}` } });
      updatePetState(res.data);
    } catch (error) {
      console.error("Error al alimentar", error);
    }
  };

  const handleCuddle = async (petId) => {
    // ... (Esta función se queda exactamente igual)
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:8080/api/pets/${petId}/cuddle`, {}, { headers: { Authorization: `Bearer ${token}` } });
      updatePetState(res.data);
    } catch (error) {
      console.error("Error al mimar", error);
    }
  };

  const handleDelete = async (petId) => {
    // ... (Esta función se queda exactamente igual)
    if (window.confirm("¿Estás seguro de que quieres liberar a esta criatura?")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchPets();
      } catch (error) {
        console.error("Error al eliminar la mascota", error);
      }
    }
  };

  const handleLogout = () => {
    // ... (Esta función se queda exactamente igual)
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="page-container">
      <main className="dashboard-main">
        <h1>Tu Espacio de Humo</h1>

        {/* --- FORMULARIO DE CREACIÓN (AHORA SIEMPRE VISIBLE) --- */}
        <div className="creation-hub">
          <h2>Añade una nueva criatura</h2>
          <form onSubmit={handleCreatePet} className="creation-form">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
            <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Características especiales (ej: 'brilla en la oscuridad')" required />
            <div className='color-picker-wrapper'>
              <label>Color:</label>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} />
            </div>
            <button type="submit">Crear</button>
          </form>
        </div>

        <hr className="separator" />

        {/* --- ZONA DE MASCOTAS --- */}
        {loading ? <p>Cargando tus criaturas...</p> : (
          pets.length === 0 ? (
            <p>Aún no tienes ninguna mascota. ¡Crea una usando el formulario de arriba!</p>
          ) : (
            <div className="pets-grid">
              {pets.map(pet => (
                <PetCard key={pet.id} pet={pet} onFeed={handleFeed} onCuddle={handleCuddle} onDelete={handleDelete} />
              ))}
            </div>
          )
        )}
      </main>
      <footer className="dashboard-footer">
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </footer>
    </div>
  );
}
export default PetDashboard;