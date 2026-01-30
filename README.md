# Task Manager - MERN Stack con Arquitectura MVC

Sistema completo de gestión de tareas refactorizado desde una aplicación legacy de 4 archivos a una arquitectura profesional MERN (MongoDB, Express, React, Node.js) con patrón MVC.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Credenciales de Prueba](#credenciales-de-prueba)

## ✨ Características

### Funcionalidades
- ✅ **Autenticación JWT**: Sistema seguro de login con tokens
- ✅ **CRUD de Tareas**: Crear, leer, actualizar y eliminar tareas
- ✅ **CRUD de Proyectos**: Gestión completa de proyectos
- ✅ **Sistema de Comentarios**: Comentarios en tareas
- ✅ **Historial de Auditoria**: Registro de todos los cambios
- ✅ **Notificaciones**: Sistema de notificaciones por usuario
- ✅ **Búsqueda Avanzada**: Filtros múltiples para tareas
- ✅ **Reportes y Exportación**: Reportes y exportación a CSV
- ✅ **Estadísticas en Tiempo Real**: Dashboard con métricas

### Arquitectura
- **Backend**: Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Patrón MVC**: Separación clara de Modelos, Vistas y Controladores
- **API RESTful**: Endpoints bien estructurados y documentados

## 🛠️ Tecnologías

### Backend
- **Node.js** (Runtime)
- **Express** (Framework web)
- **TypeScript** (Tipado estático)
- **MongoDB Atlas** (Base de datos NoSQL)
- **Mongoose** (ODM para MongoDB)
- **JWT** (Autenticación)
- **bcryptjs** (Hash de contraseñas)

### Frontend
- **React 18** (UI Library)
- **Vite** (Build tool)
- **TypeScript** (Tipado estático)
- **TailwindCSS** (Estilos)
- **React Router** (Navegación)
- **Axios** (HTTP client)

## 📁 Estructura del Proyecto

```
Legacyy/
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/           # Configuración (DB)
│   │   ├── models/           # Modelos de Mongoose
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── Task.ts
│   │   │   ├── Comment.ts
│   │   │   ├── History.ts
│   │   │   ├── Notification.ts
│   │   │   └── index.ts
│   │   ├── controllers/      # Controladores (lógica de negocio)
│   │   │   ├── authController.ts
│   │   │   ├── taskController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── historyController.ts
│   │   │   ├── notificationController.ts
│   │   │   ├── searchController.ts
│   │   │   └── reportController.ts
│   │   ├── routes/           # Rutas de la API
│   │   │   ├── authRoutes.ts
│   │   │   ├── taskRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   └── ... (otras rutas)
│   │   ├── middleware/       # Middleware (auth, errores)
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/            # Utilidades
│   │   │   └── seed.ts
│   │   └── server.ts         # Servidor principal
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── layout/       # Layout (Header, Nav, Stats)
│   │   │   └── ui/           # Componentes reutilizables
│   │   ├── pages/            # Páginas
│   │   │   ├── LoginPage.tsx
│   │   │   ├── TasksPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   └── ...
│   │   ├── services/         # Servicios API
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── taskService.ts
│   │   │   └── ...
│   │   ├── context/          # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── types/            # TypeScript Types
│   │   │   └── index.ts
│   │   ├── App.tsx           # Componente principal
│   │   ├── main.tsx          # Punto de entrada
│   │   └── index.css         # Estilos globales
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md                  # Este archivo
```

## 📋 Requisitos Previos

- **Node.js** 18+ y npm
- **MongoDB Atlas** (cuenta gratuita)
- **Git**

## 🚀 Instalación

### 1. Clonar o estar en el directorio del proyecto

```bash
cd c:\Users\alanm\Desktop\Legacyy
```

### 2. Instalar dependencias del Backend

```bash
cd server
npm install
```

### 3. Instalar dependencias del Frontend

```bash
cd ../client
npm install
```

## ⚙️ Configuración

### Backend (.env)

1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener la URI de conexión
4. Crear archivo `.env` en la carpeta `server`:

```bash
cd server
cp .env.example .env
```

5. Editar `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala
NODE_ENV=development
```

**Importante**: Reemplaza `usuario`, `password` y `cluster` con tus credenciales de MongoDB Atlas.

### Frontend (.env)

```bash
cd client
cp .env.example .env
```

El archivo ya está configurado para desarrollo:

```env
VITE_API_URL=http://localhost:5000/api
```

### Poblar la Base de Datos

Ejecutar el script de seed para crear datos de prueba:

```bash
cd server
npm run seed
```

Esto creará:
- 3 usuarios (admin, user1, user2)
- 3 proyectos
- 5 tareas de ejemplo

## 🎬 Ejecución

### Opción 1: Ejecutar Backend y Frontend por separado

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

El servidor estará en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

La aplicación estará en: `http://localhost:3000`

### Opción 2: Desde la raíz (requiere configuración adicional)

Puedes crear scripts en el package.json raíz para ejecutar ambos con `concurrently`.

## 🔑 Credenciales de Prueba

```
Admin:
- Usuario: admin
- Contraseña: admin123

Usuario 1:
- Usuario: user1
- Contraseña: user123

Usuario 2:
- Usuario: user2
- Contraseña: user123
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual (requiere token)

### Tareas
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/stats` - Estadísticas

### Proyectos
- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Obtener proyecto
- `POST /api/projects` - Crear proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Comentarios
- `GET /api/comments/task/:taskId` - Comentarios de tarea
- `POST /api/comments` - Crear comentario

### Historial
- `GET /api/history/task/:taskId` - Historial de tarea
- `GET /api/history/all` - Todo el historial

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/read` - Marcar como leídas

### Búsqueda
- `GET /api/search?text=&status=&priority=&projectId=` - Buscar tareas

### Reportes
- `GET /api/reports/tasks` - Reporte de tareas
- `GET /api/reports/projects` - Reporte de proyectos
- `GET /api/reports/users` - Reporte de usuarios
- `GET /api/reports/export-csv` - Exportar CSV

## 🎨 Diseño

La aplicación usa **TailwindCSS** con un diseño moderno y profesional:
- Paleta de colores azul (primary)
- Componentes reutilizables (Button, Input, Select, Card)
- Diseño responsive
- Transiciones suaves
- Estados visuales claros

## 📝 Notas Técnicas

### Diferencias con el Sistema Legacy

| Legacy | Nuevo Sistema |
|--------|---------------|
| localStorage | MongoDB Atlas |
| 4 archivos | 50+ archivos modulares |
| JavaScript vanilla | TypeScript + React |
| Sin autenticación real | JWT con bcrypt |
| Estilos CSS básicos | TailwindCSS moderno |
| Sin backend | API RESTful completa |

### Mejores Prácticas Implementadas

- ✅ Separación de responsabilidades (MVC)
- ✅ Tipado estático con TypeScript
- ✅ Manejo centralizado de errores
- ✅ Validación de datos (Mongoose)
- ✅ Seguridad (JWT, bcrypt, CORS)
- ✅ Código limpio y comentado
- ✅ Componentes reutilizables
- ✅ Estado global con Context API
- ✅ Rutas protegidas
- ✅ Interceptores de axios

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que la URI en `.env` sea correcta
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas
- Revisa usuario y contraseña

### Error de CORS
- Verifica que el backend esté corriendo en puerto 5000
- Revisa la configuración de proxy en `vite.config.ts`

### Errores de TypeScript
- Ejecuta `npm install` en ambas carpetas
- Verifica las versiones de Node.js (18+)

## 📚 Próximos Pasos

Funcionalidades adicionales que puedes implementar:
- [ ] Paginación en listas
- [ ] Filtros avanzados
- [ ] Drag & drop para tareas
- [ ] Adjuntar archivos
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Dashboard con gráficos
- [ ] Tests unitarios y E2E
- [ ] Docker y Docker Compose
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en Vercel (frontend) y Railway/Render (backend)

## 📄 Licencia

MIT

## 👥 Autor

Refactorizado desde sistema legacy a arquitectura MERN profesional.

---

**¡Feliz desarrollo! 🚀**
