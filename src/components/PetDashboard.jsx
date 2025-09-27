import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PetView from './PetView.jsx';
import AccessoryPanel from './AccessoryPanel.jsx';
import PetCard from './PetCard.jsx';
import './PetDashboard.css';

function PetDashboard() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#FFA500');
  const [isAccessoryPanelOpen, setAccessoryPanelOpen] = useState(false);

  const activePet = pets.length > 0 ? pets[0] : null;

  // useCallback memoriza la función para que no se cree de nuevo en cada render
  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { handleLogout(); return; }
      const response = await axios.get('http://localhost:8080/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
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
  }, []); // El array vacío significa que la función nunca cambia

  useEffect(() => {
    fetchPets();
  }, [fetchPets]); // Se ejecuta solo cuando fetchPets cambia (una vez)

  const updatePetState = (updatedPet) => {
    setPets(currentPets => currentPets.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const handleCreatePet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/pets', { name: newName, color: newColor }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewName('');
      setNewColor('#FFA500');
      fetchPets();
    } catch (error) {
      console.error("Error al crear la mascota", error);
    }
  };
  
  const makePetRequest = async (url, petId) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
        updatePetState(res.data);
    } catch (error) {
        console.error(`Error en la petición a ${url}`, error);
    }
  };

  const handleFeed = (petId) => makePetRequest(`http://localhost:8080/api/pets/${petId}/feed`, petId);
  const handleCuddle = (petId) => makePetRequest(`http://localhost:8080/api/pets/${petId}/cuddle`, petId);

  const handleEquipAccessory = async (petId, accessoryType, accessoryName) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`http://localhost:8080/api/pets/${petId}/equip`, 
        { accessoryType, accessoryName: accessoryName || '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updatePetState(res.data);
    } catch (error) {
      console.error(`Error al equipar ${accessoryType}:`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };
  
  return (
    <div className="dashboard-layout">
      <div className="control-panel">
        <h2>Panel de Control</h2>
        <hr className="separator" />
        {loading ? <p>Cargando...</p> : activePet ? (
          <>
            <PetCard 
              pet={activePet} 
              onFeed={handleFeed} 
              onCuddle={handleCuddle}
              onCustomize={() => setAccessoryPanelOpen(true)} 
            />
            <hr className="separator" />
            <p>Personaliza a {activePet.name}:</p>
            {/* Aquí podríamos mostrar un panel de personalización fijo en lugar de un modal */}
          </>
        ) : (
          <div className="creation-hub">
            <h3>¡Crea tu primera mascota!</h3>
            <form onSubmit={handleCreatePet} className="creation-form">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre" required />
              <div className='color-picker-wrapper'>
                <label>Color:</label>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} />
              </div>
              <button type="submit">Crear</button>
            </form>
          </div>
        )}
        <button onClick={handleLogout} style={{marginTop: 'auto'}} className="logout-button">Cerrar Sesión</button>
      </div>
      <div className="pet-view-area">
        {activePet ? <PetView pet={activePet} /> : (
          <div className="no-pets-message">
            <h1>¡Bienvenido!</h1>
            <p>Crea una mascota para empezar.</p>
          </div>
        )}
      </div>
      {isAccessoryPanelOpen && activePet && (
        <AccessoryPanel 
          pet={activePet} 
          onEquipAccessory={handleEquipAccessory} 
          onClose={() => setAccessoryPanelOpen(false)} 
        />
      )}
    </div>
  );
}

export default PetDashboard;