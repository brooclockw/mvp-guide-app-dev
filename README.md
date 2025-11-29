# Backoffice de Turismo

Sistema de gestión administrativa para aplicación de turismo.

## 🧱 Monorepo y Workspaces

- Este proyecto está configurado como monorepo con `npm workspaces` en la raíz (`package.json`).
- Workspaces: `backend`, `frontend` y `shared`.
- Lockfile único en la raíz (`package-lock.json`). No se usan lockfiles en cada paquete.

## 🏗️ Arquitectura del Proyecto

```
backoffice-turismo/
├── backend/           # API REST con Express + TypeScript
├── frontend/          # Interfaz React + TypeScript + Vite
├── shared/            # Tipos y constantes compartidas
└── docs/              # Documentación
```

## 🔗 Paquete Compartido (`@backoffice-guide/shared`)

- Exporta tipos y constantes comunes para `backend` y `frontend`.
- Se consume mediante el alias `@backoffice-guide/shared`.
- En dependencias de `backend` y `frontend` se enlaza localmente con `"file:../shared"` para desarrollo dentro del monorepo.
- Ejemplo de uso:

```ts
import { UserRole } from '@backoffice-guide/shared'
```

## ⚙️ Configuración TypeScript

- Configuración base en `tsconfig.base.json` en la raíz, extendida por cada paquete.
- Backend referencia el paquete `shared` mediante `paths` en `tsconfig`.
- Frontend define alias en Vite y `tsconfig` para importar `@backoffice-guide/shared`.

## 🛠️ Scripts en la Raíz

- `npm run dev` → Ejecuta `backend` y `frontend` en paralelo.
- `npm run build` → Compila todos los workspaces (`shared`, `backend`, `frontend`).
- `npm run type-check` → Ejecuta `tsc --noEmit` en cada workspace.
- `npm run lint:all` → Ejecuta `lint` en cada workspace si existe configuración ESLint.
- `npm run install:all` → Instala dependencias en el monorepo.
- `npm run clean` → Ejecuta `clean` en cada workspace (si existe).

## ▶️ Desarrollo Local

- Terminal 1: `npm run dev` en la raíz para levantar API y web.
- Frontend: disponible en `http://localhost:5173`.
- Backend: disponible en `http://localhost:3000`.

## 📦 Build y Verificación

- `npm run type-check` para validar tipos en todo el monorepo.
- `npm run build` para generar `dist` en `shared` y `backend`, y build de `frontend` con Vite.
- `npm run lint:all` para linting si tienes configuración ESLint en cada paquete.

## 📦 Módulos del Sistema

### 1. Autenticación y Autorización
- Login/Logout
- Gestión de roles y permisos
- Recuperación de contraseña

### 2. Dashboard
- Estadísticas generales
- Métricas de negocio
- Gráficos y reportes

### 3. Gestión de Destinos
- CRUD de destinos turísticos
- Gestión de categorías
- Imágenes y multimedia

### 4. Gestión de Tours/Paquetes
- Crear y editar tours
- Gestión de itinerarios
- Precios y disponibilidad

### 5. Gestión de Reservas
- Ver y gestionar reservas
- Estados de reserva
- Historial de transacciones

### 6. Gestión de Clientes
- Base de datos de clientes
- Historial de reservas por cliente
- Comunicación con clientes

### 7. Gestión de Hoteles/Alojamientos
- CRUD de alojamientos
- Disponibilidad y precios
- Integración con reservas

### 8. Gestión de Transporte
- Vehículos y rutas
- Disponibilidad
- Integración con tours

### 9. Reportes y Analytics
- Reportes de ventas
- Análisis de destinos populares
- Métricas de rendimiento

### 10. Configuración
- Parámetros del sistema
- Integraciones con APIs externas
- Gestión de usuarios administrativos

## 🚀 Tecnologías

**Backend:**
- Node.js + Express
- TypeScript
- Supabase Auth para autenticación
- PostgreSQL (a través de Supabase)

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS (opcional)

## 📚 Documentación adicional

- Instalación y variables de entorno: `docs/INSTALACION.md`
- Detalle de módulos funcionales: `docs/MODULOS.md`

## 📝 Próximos Pasos

1. Configurar entorno de desarrollo
2. Implementar módulo de autenticación
3. Crear dashboard principal
4. Desarrollar módulos uno por uno

