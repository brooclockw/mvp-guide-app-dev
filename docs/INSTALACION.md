# Guía de Instalación - Backoffice de Turismo

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- PostgreSQL (opcional, para producción)
- Git

## 🚀 Instalación Rápida

### 1. Clonar o Navegar al Proyecto

```bash
cd backoffice-turismo
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno

**Backend:**
```bash
cd backend
# El archivo .env ya está creado, edítalo con tus credenciales de Supabase
# Necesitas:
# - SUPABASE_URL: URL de tu proyecto Supabase
# - SUPABASE_ANON_KEY: Clave anónima de Supabase
# - SUPABASE_SERVICE_ROLE_KEY: Clave de servicio de Supabase (para operaciones admin)
```

**Frontend:**
```bash
cd frontend
# Crear archivo .env con:
# VITE_SUPABASE_URL=tu_supabase_url
# VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
# VITE_API_URL=http://localhost:3000/api (opcional)
```

### 4. Instalar Dependencias del Frontend

```bash
cd ../frontend
npm install
```

### 5. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🔐 Configuración de Supabase

Este proyecto usa **Supabase Auth** para la autenticación. Necesitas:

1. **Crear un proyecto en Supabase:**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Obtén la URL y las claves desde Settings > API

2. **Configurar variables de entorno:**
   - Backend: Edita `backend/.env` con tus credenciales
   - Frontend: Crea `frontend/.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

3. **Crear tabla de perfiles (opcional):**
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name TEXT,
     role TEXT DEFAULT 'user',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Crear usuario de prueba:**
   - Desde el dashboard de Supabase, crea un usuario manualmente
   - O usa la función de registro si está implementada

> ⚠️ **Nota:** Asegúrate de configurar las políticas RLS (Row Level Security) en Supabase según tus necesidades.

## 📁 Estructura del Proyecto

```
backoffice-turismo/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Controladores de la API
│   │   ├── middleware/     # Middleware (auth, error handling)
│   │   ├── routes/         # Rutas de la API
│   │   └── index.ts        # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas/Vistas
│   │   ├── context/        # Context API (Auth)
│   │   ├── services/       # Servicios API
│   │   └── App.tsx         # Componente principal
│   ├── package.json
│   └── vite.config.ts
└── docs/
    ├── MODULOS.md          # Documentación de módulos
    └── INSTALACION.md       # Esta guía
```

## 🛠️ Comandos Útiles

### Backend

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Compilar TypeScript
npm run start    # Ejecutar versión compilada
npm run lint     # Verificar código
```

### Frontend

```bash
npm run dev      # Desarrollo con Vite
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Verificar código
```

## 🗄️ Base de Datos (Opcional)

Actualmente el proyecto usa datos mock. Para conectar a una base de datos real:

1. **PostgreSQL:**
   ```bash
   # Instalar PostgreSQL
   # Crear base de datos
   createdb turismo_db
   ```

2. **Configurar en `.env`:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=turismo_db
   DB_USER=postgres
   DB_PASSWORD=tu_password
   ```

3. **Implementar modelos Sequelize** (ver documentación en `docs/MODULOS.md`)

## 🐛 Solución de Problemas

### Error: Puerto en uso
```bash
# Cambiar puerto en .env (backend) o vite.config.ts (frontend)
```

### Error: Módulos no encontrados
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
```bash
# Verificar CORS_ORIGIN en backend/.env
# Debe coincidir con la URL del frontend
```

## 📚 Próximos Pasos

1. Revisar la documentación de módulos en `docs/MODULOS.md`
2. Configurar base de datos real
3. Implementar autenticación completa
4. Desarrollar módulos según prioridad

## 🔗 Enlaces Útiles

- [Documentación de Módulos](./MODULOS.md)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

