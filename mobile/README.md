# Mobile App - React Native con Expo

Aplicación móvil del sistema de gestión administrativa desarrollada con React Native y Expo.

## 📱 Tecnologías

- **Expo**: ~54.0.25 (SDK 54)
- **React**: 19.1.0
- **React Native**: 0.81.5
- **TypeScript**: ~5.9.2

## 🚀 Inicio Rápido

### Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
cd mobile
npm install
```

### Configuración

1. **Crea un archivo `.env` en la carpeta `mobile/`** con las siguientes variables:

```env
# Supabase (REQUERIDO)
# Obtén estos valores desde tu proyecto de Supabase: Settings > API
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# API Backend (opcional, si usas endpoints adicionales)
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- Las variables de entorno en Expo deben empezar con `EXPO_PUBLIC_` para estar disponibles en el cliente
- Después de crear o editar el archivo `.env`, **reinicia el servidor de Expo** con `npm start -- --clear`
- El archivo `.env` está en `.gitignore` y no se subirá al repositorio

**Cómo obtener las credenciales de Supabase:**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a **Settings > API**
3. Copia:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Nota importante para dispositivos físicos:**
- Si pruebas en un dispositivo físico Android/iOS, necesitas usar la IP de tu máquina en lugar de `localhost`
- Ejemplo: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`
- Para emulador Android: `http://10.0.2.2:3000`
- Para emulador iOS: `http://localhost:3000`

### Ejecutar la aplicación

```bash
# Desde la raíz del monorepo
npm run dev:mobile

# O desde la carpeta mobile
cd mobile
npm start
```

### Comandos disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Ejecuta en Android (requiere emulador o dispositivo físico)
- `npm run ios` - Ejecuta en iOS (requiere macOS y Xcode)
- `npm run web` - Ejecuta en navegador web

## 📁 Estructura del Proyecto

```
mobile/
├── App.tsx                    # Componente principal
├── app.json                   # Configuración de Expo
├── assets/                    # Recursos (iconos, imágenes)
├── src/
│   ├── config/                # Configuración (API, env)
│   ├── context/               # Contextos de React (Auth)
│   ├── navigation/             # Navegación (React Navigation)
│   ├── screens/               # Pantallas de la app
│   ├── services/              # Servicios (API, Auth)
│   └── types/                 # Tipos TypeScript
├── index.ts                   # Punto de entrada
└── tsconfig.json              # Configuración TypeScript
```

## 🔐 Autenticación

La app incluye un sistema completo de autenticación usando **Supabase**:

- **Login**: Pantalla de inicio de sesión con validación
- **Dashboard**: Pantalla protegida que muestra información del usuario
- **Context API**: Manejo global del estado de autenticación
- **Persistencia**: Sesión almacenada de forma segura con Expo SecureStore
- **Navegación automática**: Redirige según el estado de autenticación
- **Supabase Integration**: Autenticación directa con Supabase Auth

### Funcionalidades implementadas:

- ✅ Login con email y contraseña (Supabase Auth)
- ✅ Registro de usuarios (Supabase Auth + tabla profiles)
- ✅ Logout
- ✅ Verificación automática de sesión al iniciar
- ✅ Manejo de errores
- ✅ Integración con Supabase (Auth + Database)
- ✅ Tipos compartidos desde `shared/`
- ✅ Almacenamiento seguro de tokens con Expo SecureStore

## 🔧 Desarrollo

### Requisitos

- Node.js 18+
- Expo CLI (instalado globalmente o vía npx)
- Para Android: Android Studio y emulador
- Para iOS: macOS, Xcode y simulador

### Instalar Expo CLI globalmente (opcional)

```bash
npm install -g expo-cli
```

### Ejecutar en dispositivo físico

1. Instala la app **Expo Go** en tu dispositivo:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Ejecuta `npm start` y escanea el código QR con:
   - Android: Expo Go app
   - iOS: Cámara nativa

## 📦 Integración con el Monorepo

Este proyecto está integrado en el monorepo y puede compartir código con:
- `shared/` - Tipos y constantes compartidas
- `backend/` - API backend
- `frontend/` - Aplicación web frontend

## 🔗 Recursos

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/)
- [Guía de TypeScript con Expo](https://docs.expo.dev/guides/typescript/)

