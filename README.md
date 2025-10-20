🐾 Virtual Pet API & Dashboard
Descripción del Proyecto
Virtual Pet API & Dashboard es una aplicación full-stack que simula una mascota virtual. El backend (Spring Boot) gestiona la lógica de negocio, la persistencia y la autenticación, mientras que el frontend (React + Vite) proporciona la interfaz de usuario interactiva para gestionar y visualizar la mascota.

🛠️ Stack Tecnológico
Componente	Capa	Versión / Tecnología	Notas
Backend	API	Java 21, Spring Boot 3.5.5	Seguridad JWT, Spring Cache.
Frontend	UI	React, Vite	Desarrollo moderno y rápido.
Persistencia	API	Spring Data JPA / Hibernate	Manejo de la base de datos.
Seguridad	API	Spring Security, JWT	Autenticación y Autorización por tokens.
Logging	API	SLF4J / Logback	Sistema de registro configurable.

Exportar a Hojas de cálculo

🚀 Estructura del Proyecto
El proyecto está dividido en dos componentes principales: el backend (src/main) y el frontend (asumiendo que está en una carpeta raíz como frontend/ o similar, si no se especifica).

🌳 Estructura del Backend (src/main/java/com/virtualpet/api)
La estructura sigue convenciones de Spring Boot, organizada por capas:

src/main/java/com/virtualpet/api
├───config          // Configuración general (OpenAPI)
├───controller      // Endpoints de la API (Auth, Pet, Admin, User)
├───dto             // Objetos de Transferencia de Datos (Request/Response)
├───model           // Entidades de Dominio (User, Pet, Role)
├───repository      // Acceso a la base de datos (JPA Repositories)
├───security        // Servicios JWT, Filtros y Configuración de Spring Security
└───service         // Lógica de negocio (Auth, Pet, User)
💻 Frontend (React + Vite)
El Dashboard de la mascota virtual está construido con React y Vite, proporcionando una experiencia de usuario rápida y moderna.

Características
PetDashboard: Componente principal para visualizar y gestionar el estado de la mascota (alimentar, jugar).

Axios Interceptors: Manejo de solicitudes HTTP, incluyendo la inyección automática del token JWT para endpoints protegidos.

Desarrollo Rápido: Utiliza Vite para un arranque y recarga en caliente extremadamente rápidos.

Dependencias Clave (Asumidas)
react, react-dom

vite

axios (para la comunicación con la API)

react-router-dom (para la navegación)

⚙️ Configuración y Ejecución
Para ejecutar la aplicación completa, debe iniciar tanto el backend (API) como el frontend (UI).

Prerrequisitos
Backend: Java Development Kit (JDK) 21

Frontend: Node.js (v18+) y npm/yarn

Una base de datos relacional (configurada en application.properties)

Paso 1: Iniciar el Backend (API)
Configuración de la BD: Modifique src/main/resources/application.properties con sus credenciales.

Ejecución: Navegue a la carpeta raíz del proyecto y use Maven:

Bash

./mvnw spring-boot:run
La API se ejecutará por defecto en http://localhost:8080.

Paso 2: Iniciar el Frontend (UI)
Asumiendo que los archivos de frontend se encuentran en una carpeta frontend/.

Navegar a la Carpeta:

Bash

cd frontend/
Instalar Dependencias:

Bash

npm install
# o yarn install
Ejecutar el Servidor de Desarrollo:

Bash

npm run dev
# o yarn dev
El frontend se ejecutará típicamente en http://localhost:5173 (o un puerto similar de Vite).

🔒 Seguridad y Caché (Backend)
Autenticación (JWT)
Login (/auth/login): Intercambia credenciales por un token JWT.

Acceso Protegido: Todos los endpoints requieren el token JWT en el encabezado Authorization: Bearer <token>.

Rendimiento y Caché
La implementación de Spring Cache se utiliza en la capa de service (PetService) para mejorar la velocidad de respuesta, especialmente en la obtención de datos de mascotas.

Nota de Depuración: Los errores de tipo 401 Unauthorized (vistos en los logs de frontend) a menudo ocurren después de implementar la caché, si esta almacena respuestas de error o si la invalidación del token no es correcta.

📝 Logging y Pruebas
Logging (SLF4J / Logback)
El backend utiliza SLF4J para el registro, con niveles configurables (INFO, DEBUG, WARN, ERROR). La configuración se encuentra en application.properties y permite la salida a consola y a ficheros.

Pruebas Automatizadas
Ubicación: src/test/java/com/virtualpet/api

Integración: Incluye pruebas clave (AuthIntegrationTest, AdminIntegrationTest) para verificar la seguridad, la autenticación y la funcionalidad de la API.

Configuración: Utiliza application-test.properties para un entorno de base de datos aislado.

📄 Documentación de la API
La documentación de la API (generada por OpenAPI/Swagger) se puede consultar una vez que el backend esté en funcionamiento:

http://localhost:8080/swagger-ui.html
