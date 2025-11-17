# Documentación de Módulos - Backoffice de Turismo

## 📋 Índice de Módulos

1. [Autenticación y Autorización](#1-autenticación-y-autorización)
2. [Dashboard](#2-dashboard)
3. [Gestión de Destinos](#3-gestión-de-destinos)
4. [Gestión de Tours/Paquetes](#4-gestión-de-tourspaquetes)
5. [Gestión de Reservas](#5-gestión-de-reservas)
6. [Gestión de Clientes](#6-gestión-de-clientes)
7. [Gestión de Hoteles/Alojamientos](#7-gestión-de-hotelesalojamientos)
8. [Gestión de Transporte](#8-gestión-de-transporte)
9. [Reportes y Analytics](#9-reportes-y-analytics)
10. [Configuración](#10-configuración)

---

## 1. Autenticación y Autorización

### Descripción
Sistema de autenticación seguro para acceder al backoffice.

### Funcionalidades
- **Login**: Autenticación con email/usuario y contraseña
- **Logout**: Cerrar sesión segura
- **Gestión de Roles**: Administrador, Editor, Visualizador
- **Permisos Granulares**: Control de acceso por módulo y acción
- **Recuperación de Contraseña**: Flujo de reset con tokens temporales
- **Sesiones**: Gestión de múltiples sesiones y tokens JWT

### Endpoints Backend
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

### Modelos de Datos
- User (id, email, password, role, permissions, createdAt, updatedAt)
- Session (id, userId, token, expiresAt, createdAt)

---

## 2. Dashboard

### Descripción
Panel principal con métricas y estadísticas del negocio.

### Funcionalidades
- **Métricas Principales**: Ventas del mes, reservas activas, destinos populares
- **Gráficos**: Ventas por período, reservas por destino, tendencias
- **Alertas**: Notificaciones de reservas pendientes, baja disponibilidad
- **Actividad Reciente**: Últimas reservas, nuevos clientes, acciones del sistema

### Endpoints Backend
```
GET    /api/dashboard/stats
GET    /api/dashboard/sales-chart
GET    /api/dashboard/bookings-chart
GET    /api/dashboard/recent-activity
```

### Componentes Frontend
- DashboardLayout
- StatsCards
- SalesChart
- BookingsChart
- RecentActivity

---

## 3. Gestión de Destinos

### Descripción
Administración de destinos turísticos disponibles en la plataforma.

### Funcionalidades
- **CRUD Completo**: Crear, leer, actualizar, eliminar destinos
- **Categorías**: Playas, Montaña, Ciudades, Aventura, Cultural, etc.
- **Multimedia**: Imágenes, videos, mapas interactivos
- **Información Detallada**: Descripción, clima, mejor época, ubicación GPS
- **Estado**: Activo/Inactivo, destacado
- **Búsqueda y Filtros**: Por nombre, categoría, país, estado

### Endpoints Backend
```
GET    /api/destinations
GET    /api/destinations/:id
POST   /api/destinations
PUT    /api/destinations/:id
DELETE /api/destinations/:id
GET    /api/destinations/:id/tours
POST   /api/destinations/:id/images
```

### Modelos de Datos
- Destination (id, name, description, category, country, city, coordinates, status, images, createdAt, updatedAt)
- Category (id, name, description, icon)

---

## 4. Gestión de Tours/Paquetes

### Descripción
Creación y administración de tours y paquetes turísticos.

### Funcionalidades
- **CRUD de Tours**: Crear, editar, eliminar tours
- **Itinerarios**: Días, actividades, horarios, lugares
- **Precios**: Precio base, descuentos, precios por temporada
- **Disponibilidad**: Fechas disponibles, cupos, stock
- **Incluye/No Incluye**: Servicios incluidos y excluidos
- **Información Adicional**: Requisitos, recomendaciones, políticas
- **Integración**: Con destinos, hoteles, transporte

### Endpoints Backend
```
GET    /api/tours
GET    /api/tours/:id
POST   /api/tours
PUT    /api/tours/:id
DELETE /api/tours/:id
GET    /api/tours/:id/availability
POST   /api/tours/:id/itinerary
GET    /api/tours/:id/bookings
```

### Modelos de Datos
- Tour (id, name, description, destinationId, duration, price, maxCapacity, status, createdAt, updatedAt)
- Itinerary (id, tourId, day, title, description, activities, meals, accommodation)
- TourAvailability (id, tourId, date, availableSpots, price)

---

## 5. Gestión de Reservas

### Descripción
Administración completa del ciclo de vida de las reservas.

### Funcionalidades
- **Listado de Reservas**: Vista con filtros y búsqueda
- **Detalle de Reserva**: Información completa del cliente y tour
- **Estados**: Pendiente, Confirmada, En Proceso, Completada, Cancelada
- **Pagos**: Registro de pagos, estados de pago, métodos
- **Modificaciones**: Cambiar fechas, agregar servicios, cancelaciones
- **Notificaciones**: Emails automáticos por cambio de estado
- **Historial**: Registro de todas las acciones sobre la reserva

### Endpoints Backend
```
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PUT    /api/bookings/:id
PUT    /api/bookings/:id/status
POST   /api/bookings/:id/payment
GET    /api/bookings/:id/history
POST   /api/bookings/:id/cancel
```

### Modelos de Datos
- Booking (id, tourId, customerId, date, numberOfGuests, totalPrice, status, paymentStatus, createdAt, updatedAt)
- Payment (id, bookingId, amount, method, status, transactionId, createdAt)
- BookingHistory (id, bookingId, action, description, userId, createdAt)

---

## 6. Gestión de Clientes

### Descripción
Base de datos y gestión de clientes de la plataforma.

### Funcionalidades
- **Listado de Clientes**: Búsqueda y filtros avanzados
- **Perfil de Cliente**: Información personal, preferencias, historial
- **Historial de Reservas**: Todas las reservas del cliente
- **Comunicación**: Envío de emails, notificaciones
- **Segmentación**: Por tipo de viaje, frecuencia, gasto
- **Notas**: Anotaciones internas sobre el cliente

### Endpoints Backend
```
GET    /api/customers
GET    /api/customers/:id
PUT    /api/customers/:id
GET    /api/customers/:id/bookings
GET    /api/customers/:id/history
POST   /api/customers/:id/notes
POST   /api/customers/:id/contact
```

### Modelos de Datos
- Customer (id, firstName, lastName, email, phone, address, birthDate, preferences, createdAt, updatedAt)
- CustomerNote (id, customerId, note, userId, createdAt)

---

## 7. Gestión de Hoteles/Alojamientos

### Descripción
Administración de alojamientos disponibles para los tours.

### Funcionalidades
- **CRUD de Alojamientos**: Crear, editar, eliminar hoteles
- **Información**: Nombre, ubicación, categoría, estrellas
- **Disponibilidad**: Fechas, habitaciones, precios
- **Servicios**: Amenidades, servicios incluidos
- **Integración con Tours**: Asignación de hoteles a tours
- **Fotos y Descripciones**: Galería de imágenes

### Endpoints Backend
```
GET    /api/accommodations
GET    /api/accommodations/:id
POST   /api/accommodations
PUT    /api/accommodations/:id
DELETE /api/accommodations/:id
GET    /api/accommodations/:id/availability
GET    /api/accommodations/:id/tours
```

### Modelos de Datos
- Accommodation (id, name, type, address, stars, description, amenities, images, createdAt, updatedAt)
- AccommodationAvailability (id, accommodationId, date, availableRooms, price)

---

## 8. Gestión de Transporte

### Descripción
Administración de vehículos y servicios de transporte.

### Funcionalidades
- **Vehículos**: Autos, buses, aviones, barcos
- **Rutas**: Origen, destino, horarios, duración
- **Disponibilidad**: Fechas y horarios disponibles
- **Precios**: Por tipo de vehículo y ruta
- **Integración**: Asignación a tours específicos
- **Conductores/Proveedores**: Gestión de recursos humanos

### Endpoints Backend
```
GET    /api/transport
GET    /api/transport/:id
POST   /api/transport
PUT    /api/transport/:id
DELETE /api/transport/:id
GET    /api/transport/routes
GET    /api/transport/:id/availability
```

### Modelos de Datos
- Transport (id, type, name, capacity, description, createdAt, updatedAt)
- Route (id, transportId, origin, destination, duration, price, schedule)

---

## 9. Reportes y Analytics

### Descripción
Sistema de reportes y análisis de datos del negocio.

### Funcionalidades
- **Reportes de Ventas**: Por período, destino, tour
- **Análisis de Destinos**: Popularidad, rentabilidad
- **Reportes de Clientes**: Segmentación, comportamiento
- **Métricas de Rendimiento**: KPIs del negocio
- **Exportación**: PDF, Excel, CSV
- **Reportes Personalizados**: Filtros y configuración avanzada

### Endpoints Backend
```
GET    /api/reports/sales
GET    /api/reports/destinations
GET    /api/reports/customers
GET    /api/reports/performance
POST   /api/reports/custom
GET    /api/reports/:id/export
```

---

## 10. Configuración

### Descripción
Configuración general del sistema y parámetros.

### Funcionalidades
- **Configuración General**: Parámetros del sistema
- **Integraciones**: APIs externas, pasarelas de pago
- **Usuarios Administrativos**: Gestión de usuarios del backoffice
- **Notificaciones**: Configuración de emails, SMS
- **Idiomas y Monedas**: Configuración regional
- **Backups**: Configuración de respaldos automáticos

### Endpoints Backend
```
GET    /api/config
PUT    /api/config
GET    /api/config/users
POST   /api/config/users
PUT    /api/config/users/:id
GET    /api/config/integrations
PUT    /api/config/integrations
```

---

## 🔄 Flujos de Trabajo Principales

### Flujo de Reserva
1. Cliente realiza reserva en frontend público
2. Reserva aparece en backoffice como "Pendiente"
3. Administrador revisa y confirma
4. Se envía confirmación al cliente
5. Seguimiento hasta completar el viaje

### Flujo de Creación de Tour
1. Crear o seleccionar destino
2. Crear tour con información básica
3. Agregar itinerario día por día
4. Configurar precios y disponibilidad
5. Asignar hoteles y transporte
6. Publicar tour

---

## 📊 Modelos de Datos Relacionales

```
User ──┐
       ├──> Booking ──> Tour ──> Destination
Customer ─┘              │
                        ├──> Accommodation
                        └──> Transport
```

---

## 🔐 Permisos por Módulo

| Módulo | Visualizar | Crear | Editar | Eliminar |
|--------|-----------|-------|--------|----------|
| Dashboard | ✅ | - | - | - |
| Destinos | ✅ | ✅ | ✅ | ✅ |
| Tours | ✅ | ✅ | ✅ | ✅ |
| Reservas | ✅ | ✅ | ✅ | ⚠️ |
| Clientes | ✅ | ✅ | ✅ | ⚠️ |
| Hoteles | ✅ | ✅ | ✅ | ✅ |
| Transporte | ✅ | ✅ | ✅ | ✅ |
| Reportes | ✅ | - | - | - |
| Configuración | ✅ | ⚠️ | ⚠️ | ⚠️ |

✅ = Disponible para Editor y Admin
⚠️ = Solo Administrador

