# Backoffice de Turismo

Sistema de gestión administrativa para aplicación de turismo.

## 🏗️ Arquitectura del Proyecto

```
backoffice-turismo/
├── backend/          # API REST con Express + TypeScript
├── frontend/         # Interfaz React + TypeScript + Vite
└── docs/            # Documentación de módulos
```

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
- JWT para autenticación
- PostgreSQL/MongoDB

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS (opcional)

## 📝 Próximos Pasos

1. Configurar entorno de desarrollo
2. Implementar módulo de autenticación
3. Crear dashboard principal
4. Desarrollar módulos uno por uno

