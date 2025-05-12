## Instrucciones para ejecutar el proyecto y los tests

### Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) instalado
- [Node.js 18+](https://nodejs.org/) y npm instalados

---

### 1. Ejecución del Backend (API ASP.NET Core)

1. Abre una terminal y navega a la carpeta `backend`:
   ```powershell
   cd backend
   ```
2. Restaura los paquetes NuGet:
   ```powershell
   dotnet restore
   ```
3. Inicia la API:

   ```powershell
   dotnet run --project Api/Api.csproj
   ```

   La API estará disponible en `http://localhost:5119`.

   **Nota:** Al ejecutar el backend por primera vez, se generará automáticamente la base de datos SQLite con datos de prueba preconfigurados.

---

### 2. Ejecución del Frontend (Next.js)

1. Abre una nueva terminal y navega a la carpeta `frontend`:
   ```powershell
   cd frontend
   ```
2. Instala las dependencias:
   ```powershell
   npm install
   ```
3. Inicia la aplicación Next.js en modo desarrollo:
   ```powershell
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:3000`.

---

#### Opcional: Ejecutar el frontend en modo producción

1. Genera la build de producción:
   ```powershell
   npm run build
   ```
2. Inicia el frontend en modo producción:
   ```powershell
   npm run start
   ```
   El frontend estará disponible en `http://localhost:3000`.

---

### 3. Ejecución de los tests unitarios del backend

1. Abre una terminal y navega a la carpeta `backend`:
   ```powershell
   cd backend
   ```
2. Ejecuta los tests unitarios:
   ```powershell
   dotnet test ApiLibrary.Tests/ApiLibrary.Tests.csproj
   ```
   Esto ejecutará todos los tests unitarios de modelos y controladores.

---

### Notas adicionales

- El backend y el frontend deben ejecutarse ambos en HTTP para evitar problemas de CORS y certificados.
- La base de datos utilizada por defecto es SQLite y el archivo se encuentra en `database/gestion_propiedades.db`.
  > 💡 Se eligió SQLite por su portabilidad y facilidad de configuración, permitiendo que cualquier evaluador pueda ejecutar el proyecto sin necesidad de instalar o configurar sistemas de gestión de bases de datos adicionales.
- El sistema inicializa automáticamente la base de datos con información de prueba cuando se ejecuta el backend por primera vez.
- Los tests usan una base de datos en memoria, por lo que no afectan los datos reales.

---

**¡Listo! Con estos pasos puedes ejecutar y probar el sistema de gestión de propiedades y sus tests.**
