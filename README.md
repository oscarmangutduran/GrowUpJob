# GrowUpJob

Aplicación para búsqueda de empleo.

## Guía de Inicio Rápido

Para levantar los servidores de desarrollo de la aplicación (tanto el frontend como el backend), sigue los pasos a continuación.

---

### 1. Backend (Laravel 11)

El backend gestiona la API de autenticación y los datos de empleo. Asegúrate de tener XAMPP y MySQL corriendo.

1. Abre una terminal y navega al directorio del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias de PHP (si no lo has hecho aún):
   ```bash
   composer install
   ```
3. Ejecuta las migraciones de base de datos (para crear las tablas necesarias):
   ```bash
   php artisan migrate
   ```
4. Levanta el servidor local de desarrollo:
   ```bash
   php artisan serve
   ```
   *El backend estará disponible en `http://127.0.0.1:8000`.*

---

### 2. Frontend (React Native + Expo)

El cliente frontend es una aplicación híbrida móvil desarrollada con Expo.

1. Abre otra terminal independiente y navega al directorio del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias de Node.js (si no lo has hecho aún):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Metro/Expo:
   ```bash
   npm run start
   ```
4. Para visualizar y probar la aplicación:
   * **En tu teléfono físico**: Descarga la app **Expo Go** (de Google Play o App Store) y escanea el código QR que aparecerá en tu terminal.
   * **En un emulador**: Presiona `a` para abrir en emulador de Android o `i` para iOS simulator (si estás en macOS).
   * **En la web**: Presiona `w` para abrir en el navegador.

