import React from 'react';
import './AuthLayout.css';
import PetShowcase from './PetShowcase.jsx'; // Crearemos este componente después
import videoBg from '../assets/fondoBurbujas2.mp4'; // 1. Importa el vídeo

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-form-section">
        {children} {/* Aquí se renderizará el formulario de Login o Register */}
      </div>
      <div className="auth-showcase-section">
         {/* 2. Añade la etiqueta de vídeo */}
        <video 
          className="background-video"
          src={videoBg} 
          autoPlay 
          loop 
          muted 
        />
        {/* 3. Envuelve el contenido para que se ponga por delante */}
        <div className="showcase-content"></div>
        <PetShowcase />
      </div>
    </div>
  );
}

export default AuthLayout;