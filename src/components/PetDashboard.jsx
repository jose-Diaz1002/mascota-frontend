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

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }, []);

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
  }, [handleLogout]);

  // En PetDashboard.jsx

  // Reemplaza tu useEffect actual con este
  useEffect(() => {
    // 1. Llama a la función una vez al cargar la página
    fetchPets();

    // 2. Establece un intervalo que llama a fetchPets cada 30 segundos
    const intervalId = setInterval(fetchPets, 10000); // 30000 milisegundos = 30 segundos

    // 3. Función de limpieza: se ejecuta cuando sales de la página
    //    para detener el intervalo y evitar problemas de memoria.
    return () => clearInterval(intervalId);
  }, [fetchPets]); // El efecto depende de la función fetchPets (que está memorizada con useCallback)

  const updatePetState = useCallback((updatedPet) => {
    setPets(currentPets => currentPets.map(p => p.id === updatedPet.id ? updatedPet : p));
  }, []);

  const handleCreatePet = useCallback(async (e) => {
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
  }, [newName, newColor, fetchPets]);
  
  const handleFeed = useCallback(async (petId) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`http://localhost:8080/api/pets/${petId}/feed`, {}, { headers: { Authorization: `Bearer ${token}` } });
    updatePetState(res.data);
  }, [updatePetState]);

  const handleCuddle = useCallback(async (petId) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`http://localhost:8080/api/pets/${petId}/cuddle`, {}, { headers: { Authorization: `Bearer ${token}` } });
    updatePetState(res.data);
  }, [updatePetState]);

  const handleEquipAccessory = useCallback(async (petId, accessoryType, accessoryName) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`http://localhost:8080/api/pets/${petId}/equip`, 
      { accessoryType, accessoryName: accessoryName || '' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    updatePetState(res.data);
  }, [updatePetState]);
  
  const handleDelete = useCallback(async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres liberar a esta criatura?")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8080/api/pets/${petId}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchPets();
      } catch (error) {
        console.error("Error al eliminar la mascota", error);
      }
    }
  }, [fetchPets]);

  return (
    <div className="dashboard-layout">
      <div className="control-panel">
        <h2>Panel de Control</h2>
        <hr className="separator" />
        {loading && pets.length === 0 ? <p>Cargando...</p> : activePet ? (
          <>
            <PetCard 
              pet={activePet} 
              onFeed={handleFeed} 
              onCuddle={handleCuddle}
              onCustomize={() => setAccessoryPanelOpen(true)}
              onDelete={handleDelete}
            />
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
          <div className="no-pets-message"><h1>¡Bienvenido!</h1></div>
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