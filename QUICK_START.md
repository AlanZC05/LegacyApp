# 🚀 Quick Start Guide - Task Manager MERN

## ⚡ Inicio Rápido (5 pasos)

### 1️⃣ Configurar MongoDB Atlas

1. Ir a https://www.mongodb.com/cloud/atlas/register
2. Crear cuenta gratuita
3. Crear un cluster (seleccionar plan FREE)
4. En "Database Access" → crear usuario y contraseña
5. En "Network Access" → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Ir a "Connect" → "Connect your application" → copiar la URI

La URI se verá así:
```
mongodb+srv://usuario:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 2️⃣ Configurar Backend

```bash
cd server

# Editar .env y pegar tu URI de MongoDB
# Archivo: server/.env
# Reemplazar:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
# Con tu URI real y cambiar <password> por tu contraseña

# Instalar dependencias
npm install

# Poblar base de datos con datos de prueba
npm run seed
```

### 3️⃣ Configurar Frontend

```bash
cd ../client

# Instalar dependencias
npm install
```

### 4️⃣ Ejecutar Aplicación

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Esperardor a ver: `🚀 Servidor corriendo en puerto 5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Esperar y abrir: http://localhost:3000

### 5️⃣ Login

Usar credenciales de prueba:
```
Usuario: admin
Contraseña: admin123
```

---

## 🎯 Estructura de Comandos

### Backend (Terminal 1)
```bash
cd c:\Users\alanm\Desktop\Legacyy\server
npm install               # Solo la primera vez
npm run seed             # Solo la primera vez (popula BD)
npm run dev              # Cada vez que trabajes
```

### Frontend (Terminal 2)
```bash
cd c:\Users\alanm\Desktop\Legacyy\client
npm install              # Solo la primera vez
npm run dev              # Cada vez que trabajes
```

---

## ✅ Verificación

1. **Backend OK**: Abre http://localhost:5000 → Debes ver:
   ```json
   {"message":"Task Manager API - MERN Stack"}
   ```

2. **Frontend OK**: Abre http://localhost:3000 → Debes ver la página de login

3. **Login OK**: Ingresa admin / admin123 → Debes ver el dashboard

---

## ❌ Problemas Comunes

### Error: "Cannot connect to MongoDB"
- ✅ Verificar que la URI en `server/.env` sea correcta
- ✅ Verificar que reemplazaste `<password>` con tu contraseña real
- ✅ Verificar tu IP en MongoDB Atlas Network Access

### Error: "CORS"
- ✅ Asegúrate que el backend esté corriendo en puerto 5000
- ✅ Reinicia ambos servidores

### Error: "Module not found"
- ✅ Ejecuta `npm install` en la carpeta correspondiente

### Puerto ya en uso
- ✅ Cierra otras apps en puerto 3000 o 5000
- ✅ O cambia el puerto en los archivos de config

---

## 📚 Documentación Completa

Para más detalles, consulta:
- `README.md` - Documentación completa
- `RESUMEN_REFACTORIZACION.md` - Resumen del proyecto

---

## 🎉 ¡Listo!

Ahora puedes:
- ✅ Crear tareas
- ✅ Gestionar proyectos
- ✅ Ver notificaciones
- ✅ Explorar el código
- ✅ Agregar nuevas funcionalidades

**¡Disfruta del desarrollo! 💻**
