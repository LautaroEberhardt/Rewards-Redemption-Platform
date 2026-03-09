# AyV Uniformes — Sistema de Fidelización

Sistema web completo de fidelización de clientes para **AyV Uniformes**. Permite acumular puntos por compras, canjearlos por premios y gestionar todo el ciclo desde un panel de administración.

---

## Stack Tecnológico

| Capa                | Tecnología                                                          |
| ------------------- | ------------------------------------------------------------------- |
| **Frontend**        | Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Framer Motion |
| **Autenticación**   | Auth.js v5 (NextAuth) — Credenciales + Google OAuth                 |
| **Backend**         | NestJS 11 · TypeORM 0.3 · Passport JWT                              |
| **Base de Datos**   | PostgreSQL 15                                                       |
| **Almacenamiento**  | Cloudinary (imágenes de premios)                                    |
| **Email**           | Nodemailer (Gmail SMTP)                                             |
| **Infraestructura** | Docker Compose · Railway (backend) · Vercel (frontend)              |

---

## Funcionalidades

### Cliente

- Registro e inicio de sesión (credenciales o Google).
- Consulta de saldo de puntos en tiempo real.
- Catálogo de premios disponibles.
- Solicitud de canjes con descuento automático de puntos.
- Historial completo de transacciones (ingresos y egresos).
- Edición de perfil (nombre, teléfono, foto).
- Recuperación de contraseña por email.

### Administrador

- Panel de gestión integral.
- Asignación manual de puntos a clientes.
- CRUD de premios con carga de imágenes a Cloudinary.
- Gestión de canjes: aprobar, entregar o cancelar (con devolución de puntos).
- Listado paginado de clientes.
- Activación / desactivación de premios (soft delete).

---

## Arquitectura

```
Cliente (Next.js)  ──HTTP──▶  API (NestJS)  ──TypeORM──▶  PostgreSQL
     │                            │
     │ Auth.js v5                 │ Passport JWT
     │ (session)                  │ (guards + roles)
     ▼                            ▼
  Google OAuth              Cloudinary / Nodemailer
```

**Flujo de capas (backend):**

```
Controlador → Servicio → Repositorio → Entidad
```

- **Controladores:** Solo gestionan HTTP y autenticación, sin lógica de negocio.
- **Servicios:** Orquestan reglas de negocio, transacciones y validaciones.
- **Repositorios:** Abstraen el acceso a datos mediante TypeORM.
- **Entidades:** Definen la estructura de la base de datos.

---

## Estructura del Proyecto

```
├── docker-compose.yml
├── frontend/                   # Next.js 16 (App Router)
│   ├── app/
│   │   ├── (auth)/             # Login, registro, recuperar contraseña
│   │   ├── admin/              # Panel, clientes, premios, canjes, puntos
│   │   └── cliente/            # Perfil, historial
│   ├── actions/                # Server Actions (autenticación, perfil, premios)
│   ├── components/             # Componentes UI (admin, auth, cliente, layout)
│   ├── context/                # React Context (sidebar, transiciones)
│   ├── lib/                    # Utilidades y constantes
│   ├── servicios/              # Clientes HTTP hacia la API
│   ├── tipos/                  # Definiciones TypeScript
│   ├── auth.ts                 # Configuración Auth.js v5
│   └── middleware.ts           # Protección de rutas por rol
│
└── server/                     # NestJS 11
    ├── src/
    │   ├── modules/
    │   │   ├── auth/           # Login JWT
    │   │   ├── usuarios/       # Registro, perfil, CRUD
    │   │   ├── premios/        # CRUD de premios + imágenes
    │   │   ├── puntos/         # Asignación y consulta de saldo
    │   │   ├── canjes/         # Solicitud y gestión de canjes
    │   │   └── recuperacion/   # Recuperación de contraseña
    │   ├── common/             # Guards, decoradores, interceptores
    │   ├── config/             # Configuración DB, Cloudinary, email
    │   └── migrations/         # Migraciones TypeORM
    └── test/                   # Tests E2E
```

---

## Modelo de Datos

### Usuarios

| Campo               | Tipo               | Descripción                      |
| ------------------- | ------------------ | -------------------------------- |
| `id`                | UUID (PK)          | Identificador único              |
| `nombreCompleto`    | varchar(100)       | Nombre del usuario               |
| `correo`            | varchar (unique)   | Email de acceso                  |
| `contrasena`        | varchar (nullable) | Hash bcrypt (null si usa Google) |
| `googleId`          | varchar (nullable) | ID de Google OAuth               |
| `telefono`          | varchar (nullable) | Teléfono de contacto             |
| `foto`              | text (nullable)    | URL de foto de perfil            |
| `rol`               | enum               | `ADMIN` o `CLIENTE`              |
| `saldoPuntosActual` | int                | Saldo acumulado de puntos        |

### Premios

| Campo             | Tipo     | Descripción                    |
| ----------------- | -------- | ------------------------------ |
| `id`              | int (PK) | Identificador auto-incremental |
| `nombre`          | varchar  | Nombre del premio              |
| `descripcion`     | text     | Detalle del premio             |
| `urlImagen`       | varchar  | URL de imagen (Cloudinary)     |
| `costoEnPuntos`   | int      | Puntos necesarios para canjear |
| `stockDisponible` | int      | Unidades disponibles           |
| `activo`          | boolean  | Si se muestra en el catálogo   |

### Transacciones de Puntos

| Campo           | Tipo          | Descripción                           |
| --------------- | ------------- | ------------------------------------- |
| `id`            | UUID (PK)     | Identificador único                   |
| `usuario_id`    | FK → usuarios | Cliente asociado                      |
| `cantidad`      | int           | Cantidad de puntos (siempre positivo) |
| `tipo`          | enum          | `INGRESO` o `EGRESO`                  |
| `concepto`      | varchar       | Ej: "Compra", "Canje"                 |
| `saldoAnterior` | int           | Snapshot del saldo antes              |
| `saldoNuevo`    | int           | Snapshot del saldo después            |

### Canjes

| Campo            | Tipo          | Descripción                            |
| ---------------- | ------------- | -------------------------------------- |
| `id`             | UUID (PK)     | Identificador único                    |
| `usuario_id`     | FK → usuarios | Cliente que canjea                     |
| `premio_id`      | FK → premios  | Premio canjeado                        |
| `estado`         | enum          | `PENDIENTE`, `ENTREGADO` o `CANCELADO` |
| `puntosGastados` | int           | Puntos descontados                     |

---

## Endpoints de la API

### Autenticación

| Método | Ruta          | Descripción                     |
| ------ | ------------- | ------------------------------- |
| `POST` | `/auth/login` | Inicio de sesión (credenciales) |

### Usuarios

| Método  | Ruta                     | Descripción                       |
| ------- | ------------------------ | --------------------------------- |
| `POST`  | `/usuarios/registro`     | Registro de nuevo usuario         |
| `POST`  | `/usuarios/login-google` | Autenticación con Google          |
| `GET`   | `/usuarios`              | Listar usuarios paginados (admin) |
| `GET`   | `/usuarios/perfil`       | Obtener perfil propio             |
| `PATCH` | `/usuarios/perfil`       | Actualizar perfil propio          |
| `PATCH` | `/usuarios/:id`          | Actualizar usuario (admin)        |

### Premios

| Método   | Ruta                  | Descripción                       |
| -------- | --------------------- | --------------------------------- |
| `GET`    | `/premios`            | Listar premios activos            |
| `GET`    | `/premios/admin`      | Listar todos los premios (admin)  |
| `GET`    | `/premios/:id`        | Obtener detalle de un premio      |
| `POST`   | `/premios`            | Crear premio con imagen (admin)   |
| `PATCH`  | `/premios/:id`        | Actualizar premio (admin)         |
| `PATCH`  | `/premios/:id/estado` | Activar/desactivar premio (admin) |
| `DELETE` | `/premios/:id`        | Eliminar premio (admin)           |

### Puntos

| Método | Ruta                | Descripción                         |
| ------ | ------------------- | ----------------------------------- |
| `POST` | `/puntos/asignar`   | Asignar puntos a un cliente (admin) |
| `GET`  | `/puntos/mi-saldo`  | Consultar saldo propio              |
| `GET`  | `/puntos/historial` | Historial paginado de transacciones |

### Canjes

| Método  | Ruta                 | Descripción                                 |
| ------- | -------------------- | ------------------------------------------- |
| `POST`  | `/canjes`            | Solicitar un canje (cliente)                |
| `GET`   | `/canjes/mis-canjes` | Mis canjes (cliente)                        |
| `GET`   | `/canjes/admin`      | Listar canjes con filtro por estado (admin) |
| `PATCH` | `/canjes/:id/estado` | Cambiar estado del canje (admin)            |

### Recuperación de Contraseña

| Método | Ruta                                | Descripción                      |
| ------ | ----------------------------------- | -------------------------------- |
| `POST` | `/recuperar-contrasena/solicitar`   | Enviar token por email           |
| `POST` | `/recuperar-contrasena/restablecer` | Restablecer contraseña con token |

---

## Instalación y Ejecución

### Requisitos previos

- **Node.js** >= 18
- **Docker** y **Docker Compose**
- Cuenta de **Cloudinary** (para imágenes)
- Cuenta de **Google Cloud** (para OAuth)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd sistema-uniformes
```

### 2. Configurar variables de entorno

**Backend** (`server/.env`):

```env
# JWT
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRATION=1d

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=admin
DB_NAME=uniformes_db

# Correo (Nodemailer - Gmail)
CORREO_HOST=smtp.gmail.com
CORREO_PORT=465
CORREO_GMAIL=tu_correo@gmail.com
CORREO_GMAIL_APP_PASSWORD=xxxx_xxxx_xxxx_xxxx
URL_FRONTEND=http://localhost:3001

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Admin inicial
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=tu_contraseña_admin
```

**Frontend** (`frontend/.env.local`):

```env
# Auth.js v5
AUTH_GOOGLE_ID=tu_google_client_id
AUTH_GOOGLE_SECRET=tu_google_client_secret
AUTH_SECRET=tu_secreto_auth
AUTH_URL=http://localhost:3001
AUTH_TRUST_HOST=true

# Backend
NEXT_PUBLIC_API_URL=http://localhost:4000

# WhatsApp (contacto)
NEXT_PUBLIC_WHATSAPP_TELEFONO=tu_numero_con_codigo_pais
```

### 3. Levantar la base de datos con Docker

```bash
docker compose up -d db
```

### 4. Instalar dependencias e iniciar

**Backend:**

```bash
cd server
npm install
npm run start:dev
```

El servidor se levanta en `http://localhost:4000`.

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

La aplicación se levanta en `http://localhost:3001`.

### 5. Levantar todo con Docker (alternativa)

```bash
docker compose up -d
```

Esto levanta PostgreSQL + Backend de forma conjunta.

---

## Tests

```bash
# Levantar la base de datos de test
docker compose up -d db_test

# Ejecutar tests E2E
cd server
npm run test:e2e
```

---

## Despliegue en Producción

| Servicio          | Plataforma           |
| ----------------- | -------------------- |
| **Frontend**      | Vercel               |
| **Backend**       | Railway              |
| **Base de Datos** | Railway (PostgreSQL) |

Configurar las variables de entorno de producción en cada plataforma con los valores correspondientes.

---

## Seguridad

- Contraseñas hasheadas con **bcrypt**.
- Tokens JWT con expiración configurable.
- Guards de autenticación (`JwtAuthGuard`) y autorización (`RolesGuard`).
- Middleware de protección de rutas por rol en el frontend.
- Rate limiting en endpoint de login (5 intentos/minuto).
- Transacciones de puntos con **pessimistic locking** para evitar condiciones de carrera.
- Validación global con `class-validator` (whitelist activado).
- CORS configurado por entorno.
