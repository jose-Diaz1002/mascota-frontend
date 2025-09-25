import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from './PetCard.jsx';
import './PetDashboard.css';

function PetDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#a9e4ff');
  const [features, setFeatures] = useState('');

  // Se ejecuta una vez cuando el componente se carga por primera vez.
  useEffect(() => {
    fetchPets();
  }, []);

  // Función para obtener las mascotas del usuario desde el backend.
  const fetchPets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const endpoint = role === 'ROLE_ADMIN' ? '/api/pets/all' : '/api/pets';

      // Si no hay token, no hacemos la petición y cerramos sesión.
      if (!token) {
        handleLogout();
        return;
      }

      const response = await axios.get(`http://localhost:8080${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(response.data);
    } catch (error) {
      console.error("Error al cargar las mascotas", error);
      // Si el token es inválido o ha expirado (error 401/403), cerramos sesión.
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleLogout();
      }
    } finally {
      // Pase lo que pase, dejamos de cargar.
      setLoading(false);
    }
  };

  // Maneja la creación de una nueva mascota.
  const handleCreatePet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/pets', { name, color, specialFeatures: features }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Limpiamos el formulario y recargamos la lista de mascotas.
      setName('');
      setColor('#a9e4ff');
      setFeatures('');
      fetchPets();
    } catch (error) {
      console.error("Error al crear la mascota", error);
    }
  };

  // Función para actualizar el estado de una mascota específica sin recargar toda la lista.
  const updatePetState = (updatedPet) => {
    setPets(currentPets => currentPets.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  // Maneja la acción de alimentar a una mascota.
  const handleFeed = async (petId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:8080/api/pets/${petId}/feed`, {}, { headers: { Authorization: `Bearer ${token}` } });
      updatePetState(res.data);
    } catch (error) {
      console.error("Error al alimentar", error);
    }
  };

  // Maneja la acción de mimar a una mascota.
  const handleCuddle = async (petId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:8080/api/pets/${petId}/cuddle`, {}, { headers: { Authorization: `Bearer ${token}` } });
      updatePetState(res.data);
    } catch (error) {
      console.error("Error al mimar", error);
    }
  };

  // Maneja la eliminación de una mascota.
  const handleDelete = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres liberar a esta criatura?")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchPets(); // Recarga la lista de mascotas.
      } catch (error) {
        console.error("Error al eliminar la mascota", error);
      }
    }
  };

  // Maneja el cierre de sesión.
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="page-container">
      <main className="dashboard-main">
        <h1>Tu Espacio de Humo</h1>
        {loading ? <p>Cargando tus criaturas...</p> : (
          // Si no hay mascotas, muestra el formulario de creación.
          pets.length === 0 ? (
            <div className="creation-hub">
              <h2>Crea tu primera criatura de humo</h2>
              <form onSubmit={handleCreatePet} className="creation-form">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
                <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Características especiales..." required />
                <label>Color:</label>
                <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                <button type="submit">Crear</button>
              </form>
            </div>
          ) : (
            // Si hay mascotas, muestra la lista.
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