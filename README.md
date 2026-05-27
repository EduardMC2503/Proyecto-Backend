# Vehicle Driver API

Backend local desarrollado con Node.js, Express, TypeScript, Prisma ORM y PostgreSQL para gestionar vehículos, conductores y asignaciones entre vehículos y conductores.

Este backend expone una API REST que será consumida por el frontend Angular del proyecto.

---

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- CORS
- dotenv

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- npm
- PostgreSQL
- Git

Verificar Node.js:

```bash
node --version
```

Verificar npm:

```bash
npm --version
```

Para verificar PostgreSQL en Windows:

```txt
Win + R
services.msc
```

Busca un servicio parecido a:

```txt
postgresql-x64-17
postgresql-x64-16
postgresql-x64-18
```

Debe aparecer como **En ejecución**.

---

## Instalación del backend

Clona el repositorio:

```bash
git clone URL_DEL_REPOSITORIO_BACKEND
```

Entra a la carpeta del proyecto:

```bash
cd vehicle-driver-api
```

Instala las dependencias:

```bash
npm install
```

---

## Configuración de PostgreSQL

El backend necesita una base de datos local en PostgreSQL.

Abre SQL Shell, pgAdmin o una terminal con acceso a `psql` y crea la base de datos:

```sql
CREATE DATABASE vehicle_driver_db;
```

También puedes entrar desde terminal con:

```bash
psql -U postgres
```

Luego ejecuta:

```sql
CREATE DATABASE vehicle_driver_db;
```

Para salir de PostgreSQL:

```sql
\q
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/vehicle_driver_db?schema=public"
PORT=3000
```

Reemplaza `TU_PASSWORD` por la contraseña de tu usuario `postgres`.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/vehicle_driver_db?schema=public"
PORT=3000
```

Importante: el archivo `.env` no debe subirse al repositorio.

---

## Comandos de Prisma

Generar Prisma Client:

```bash
npm run prisma:generate
```

Revisar estado de migraciones:

```bash
npm run prisma:status
```

Crear o ejecutar migraciones:

```bash
npm run prisma:migrate
```

Ejecutar seed de datos iniciales:

```bash
npm run prisma:seed
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

## Migraciones

Para crear las tablas en PostgreSQL, ejecuta:

```bash
npm run prisma:migrate
```

Este comando crea las tablas necesarias:

- Vehicle
- Driver
- VehicleDriverAssignment

---

## Seed de datos

Para insertar datos iniciales de prueba, ejecuta:

```bash
npm run prisma:seed
```

El seed incluye:

- 5 vehículos
- 5 conductores
- 2 asignaciones iniciales

---

## Ejecución del backend

Para ejecutar el backend en modo desarrollo:

```bash
npm run dev
```

Para compilar el proyecto:

```bash
npm run build
```

Para ejecutar la versión compilada:

```bash
npm start
```

El backend se ejecutará por defecto en:

```txt
http://localhost:3000
```

---

## Endpoints disponibles

### Vehículos

```txt
GET    /vehicles
GET    /vehicles/:id
POST   /vehicles
PUT    /vehicles/:id
DELETE /vehicles/:id
```

### Conductores

```txt
GET    /drivers
GET    /drivers/:id
POST   /drivers
PUT    /drivers/:id
DELETE /drivers/:id
```

### Asignaciones

```txt
GET    /assignments
GET    /assignments/:id
POST   /assignments
PATCH  /assignments/:id/finish
```

---

## Ejecución de pruebas

Para ejecutar las pruebas del backend:

```bash
npm test
```

Si existe un script específico para modo watch:

```bash
npm run test:watch
```

---

## Flujo recomendado para levantar el backend localmente

Primero asegúrate de que PostgreSQL esté encendido.

Después ejecuta:

```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

El backend quedará disponible en:

```txt
http://localhost:3000
```

---

## Notas importantes

- No subir el archivo `.env` al repositorio.
- Subir únicamente `.env.example`.
- PostgreSQL debe estar encendido antes de ejecutar migraciones o iniciar el backend.
- Las migraciones y el seed permiten que otro desarrollador pueda levantar la base de datos localmente sin necesidad de compartir una base ya creada.