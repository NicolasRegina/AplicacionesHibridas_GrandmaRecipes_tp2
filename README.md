# Grandma Recipes - Aplicación de Recetas

Una aplicación web full-stack para compartir y gestionar recetas de cocina, creada con **React** (frontend) y **Node.js/Express** (backend).

## Características

## **Autenticación y Perfiles**
- Registro e inicio de sesión de usuarios
- Gestión segura de sesiones con JWT

### **Gestión de Recetas**
- Crear, editar y eliminar recetas propias
- Ver recetas públicas y privadas
- Categorización por tipo de comida (Desayuno, Almuerzo, Cena, etc.)
- Niveles de dificultad (Fácil, Media, Difícil)
- Búsqueda y filtrado avanzado según estos mencionados anteriormente

### **Grupos y Colaboración**
- Crear grupos para conectar familias, amigos, etc.
- Compartir recetas dentro de grupos
- Gestión de miembros (admin/miembro) - TODO
- Grupos públicos y privados

### **Interfaz Moderna**
- Diseño responsive con Bootstrap 5

## Tecnologías Utilizadas

### **Frontend**
- **React 18** - Librería de interfaz de usuario
- **Vite** - Herramienta de build y desarrollo
- **Bootstrap 5** - Framework CSS
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP

### **Backend**
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Joi** - Validación de datos

## Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [MongoDB](https://www.mongodb.com/) (local o Atlas)
- [Git](https://git-scm.com/)

## Instalación y Configuración

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/AplicacionesHibridas_GrandmaRecipes_tp2.git
cd AplicacionesHibridas_GrandmaRecipes_tp2
```

### 2. **Configurar el Backend**
```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env
```

**Editar `backend/.env`** con tus configuraciones:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grandma_recipes
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
FRONTEND_URL=http://localhost:5173
```

### 3. **Configurar el Frontend**
```bash
# Navegar a la carpeta frontend
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env
```

**Editar `frontend/.env`** con tus configuraciones:
```bash
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Grandma Recipes
```

### 4. **Iniciar MongoDB**
```bash
# Si tienes MongoDB local
mongod

# O usa MongoDB Atlas (cloud)
# Cambia MONGODB_URI en backend/.env
```

## Ejecutar el Proyecto

### **Opción 1: Desarrollo (2 terminales)**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Acceso a la Aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Base de datos:** mongodb://localhost:27017

## Estructura del Proyecto

```
AplicacionesHibridas_GrandmaRecipes_tp2/
├──  backend/
│   ├── controllers/       # Lógica de negocio
│   ├── models/           # Esquemas de MongoDB
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middlewares (auth, etc.)
│   ├── validation/       # Validaciones con Joi
│   ├── public/           # Archivos estáticos
│   ├── app.js           # Configuración principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── context/      # Context API (Auth)
│   │   ├── api/          # Servicios HTTP
│   │   └── routes/       # Configuración de rutas
│   ├── public/           # Assets públicos
│   └── package.json
└── README.md
```

## Scripts Disponibles

### **Backend**
```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### **Frontend**
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
```

## API Endpoints

### **Autenticación**
- `POST /api/users/register` - Registro de usuarios
- `POST /api/users/login` - Inicio de sesión
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil

### **Recetas**
- `GET /api/recipes` - Listar recetas
- `POST /api/recipes` - Crear receta
- `GET /api/recipes/:id` - Obtener receta específica
- `PUT /api/recipes/:id` - Actualizar receta
- `DELETE /api/recipes/:id` - Eliminar receta

### **Grupos**
- `GET /api/groups` - Listar grupos
- `POST /api/groups` - Crear grupo
- `GET /api/groups/:id` - Obtener grupo específico
- `PUT /api/groups/:id` - Actualizar grupo
- `DELETE /api/groups/:id` - Eliminar grupo
- `POST /api/groups/:id/join` - Unirse a grupo

## Funcionalidades Principales

### **Para Usuarios**
1. **Registro/Login** - Crear cuenta y acceder
2. **Perfil** - Personalizar información y foto
3. **Recetas** - Crear, editar y compartir recetas
4. **Búsqueda** - Encontrar recetas por nombre, categoría, tags
5. **Grupos** - Unirse a comunidades de cocina

### **Para Administradores de Grupos**
1. **Gestión de miembros** - Aceptar/rechazar solicitudes
2. **Moderación** - Controlar contenido del grupo
3. **Configuración** - Ajustar privacidad y reglas

## Características en Desarrollo

- [ ] Sistema de valoraciones y comentarios
- [ ] Subida de imágenes local
- [ ] Búsqueda de grupos públicos
- [ ] Notificaciones en tiempo real
- [ ] Lista de compras automática
- [ ] Planificador de menús

## Autor

**Tu Nombre**
- GitHub: [@NicolasRegina](https://github.com/NicolasRegina)
- Email: nicolas.regina@davinci.edu.ar