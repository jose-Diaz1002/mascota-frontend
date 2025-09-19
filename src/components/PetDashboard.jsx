import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PetDashboard() {
  const [pets, setPets] = useState([]); // Estado para guardar la lista de mascotas
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando datos
  const [error, setError] = useState(''); // Estado para cualquier error de la API

  useEffect(() => {
    // Esta función se ejecuta solo una vez, cuando el componente se monta
    const fetchPets = async () => {
      try {
        // 1. Obtenemos el token guardado del localStorage
        const token = localStorage.getItem('token');

        // 2. Hacemos la petición a la API, incluyendo el token en las cabeceras
        const response = await axios.get('http://localhost:8080/api/pets', {
          headers: {
            Authorization: `Bearer ${token}` // Así nos autoriza el backend
          }
        });

        // 3. Guardamos la lista de mascotas en el estado
        setPets(response.data);
      } catch (err) {
        console.error("Error al obtener las mascotas:", err);
        setError('No se pudieron cargar las mascotas.');
      } finally {
        setLoading(false); // Dejamos de cargar, ya sea con éxito o error
      }
    };

    fetchPets();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // --- Renderizado del componente ---
  if (loading) {
    return <div>Cargando mascotas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>¡Bienvenido a tu Guardería de Mascotas!</h1>
        <button onClick={handleLogout} style={{ padding: '10px' }}>
          Cerrar Sesión
        </button>
      </div>

      <hr />

      <h2>Tus Criaturas</h2>
      {pets.length === 0 ? (
        <p>No tienes ninguna mascota todavía. ¡Crea una!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pets.map(pet => (
            <li key={pet.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              <strong>Nombre:</strong> {pet.name} <br />
              <strong>Tipo:</strong> {pet.creatureType} <br />
              <strong>Color:</strong> {pet.color}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PetDashboard;