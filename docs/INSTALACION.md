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

### 3. Configurar Variables de Entorno (Backend)

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
# Al menos cambiar JWT_SECRET y DB_PASSWORD si usas PostgreSQL
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

## 🔐 Credenciales de Prueba

Para el desarrollo inicial, puedes usar:

- **Email:** admin@turismo.com
- **Password:** admin123

> ⚠️ **Nota:** Estas credenciales son solo para desarrollo. Debes configurar autenticación real con base de datos en producción.

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

