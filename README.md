# ☁️ Rate My Music - Media Service (Los Pies)

Bienvenido a la documentación de **RateMyMusicMedia**. Este es el microservicio encargado del manejo de contenido multimedia y base de datos de canciones/álbumes musicales.

## 🚀 ¿Qué hace este servicio?

Este microservicio gestiona todo el ciclo de vida de los archivos multimedia (canciones, portadas de álbumes):
- Recepción de archivos a través de peticiones HTTP (FormData).
- Subida directa y optimizada hacia la nube usando **Cloudinary**.
- Almacenamiento de la metadata (URLs de streaming, títulos, artistas) en **MongoDB**.
- Validación de **Tokens JWT** antes de permitir subidas o modificaciones.

**Stack Tecnológico:** Node.js, Express v5, Mongoose (MongoDB), Cloudinary, Multer.

## 📁 Estructura del Proyecto

El código fuente principal se encuentra dentro de la carpeta `src/`, siguiendo un patrón controlador-ruta-servicio:

- `src/config/`: Configuraciones de conexión a MongoDB y Cloudinary.
- `src/controllers/`: Controladores que reciben la petición HTTP (Request) y devuelven la respuesta (Response).
- `src/middlewares/`: Middlewares de Express (ej. interceptores de autenticación JWT y configuración de Multer).
- `src/models/`: Esquemas de Mongoose que representan las colecciones de la base de datos (canciones, géneros, etc.).
- `src/routes/`: Definición de los endpoints de la API (ej. `POST /api/music/upload`).
- `src/services/`: Lógica de negocio (interacción directa con DB y APIs externas de nube).
- `src/utils/`: Funciones reutilizables y formateadores.
- `src/serve.js`: Archivo de arranque principal utilizando el nuevo *flag* nativo `--env-file` de Node.

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 20.6+ recomendada para el soporte nativo de `--env-file` y `--watch`).
- [pnpm](https://pnpm.io/) instalado globalmente (`npm install -g pnpm`).
- Instancia de MongoDB (Atlas o Local).
- Cuenta gratuita en [Cloudinary](https://cloudinary.com/).

## 🏃‍♂️ Cómo levantar el proyecto localmente

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz del proyecto (puedes basarte en `.env.example`).
   ```env
   PORT=5002
   MONGO_URI=tu_conexion_a_mongodb
   CLOUDINARY_URL=tu_url_de_cloudinary
   JWT_SECRET=tu_secreto_compartido_con_auth_service
   ```

3. **Ejecutar en modo Desarrollo (con auto-recarga):**
   ```bash
   pnpm run dev
   ```
   *(Este comando usa `node --watch`, por lo que no es necesario instalar nodemon).*

4. **Ejecutar en Producción:**
   ```bash
   pnpm start
   ```

---

## 🏗️ Topología del Ecosistema

Para entender cómo encaja esta pieza en el rompecabezas de 4 partes:

1. 👤 **La Cabeza:** [RateMyMusicPage](https://github.com/Jhomel-Dev/RateMyMusicPage) - Frontend UI.
2. 🚪 **El Cuello:** [RateMyMusicGateway](https://github.com/Jhomel-Dev/RateMyMusicGateway) - Enrutador.
3. 🦶 **Los Pies (Backend):**
   * 🔐 **[RateMyMusicAuth](https://github.com/Jhomel-Dev/RateMyMusicAuth)** - Seguridad y Usuarios.
   * ☁️ **[RateMyMusicMedia](https://github.com/Jhomel-Dev/RateMyMusicMedia)** (👉 **Estás aquí**)
