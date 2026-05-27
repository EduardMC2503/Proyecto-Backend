Crear un backend local en Node.js usando Prisma ORM y PostgreSQL para exponer una API REST que permita gestionar vehículos, conductores y asignaciones de conductores a vehículos.

Esta tarea continúa el ejercicio anterior de Angular. El objetivo es reemplazar los mocks del frontend por consumo real de API, manteniendo la estructura de arquitectura hexagonal en Angular y creando una estructura ordenada en backend.

Alcance

1. Backend local

Crear un proyecto backend con:

Node.js

Express o Fastify

Prisma ORM

PostgreSQL local

TypeScript

Variables de entorno

Migraciones con Prisma

Seed de datos iniciales

2. Base de datos

Crear las siguientes tablas mediante Prisma:

Vehículos

Vehicle {
  id: string
  code: string
  plate: string
  vin: string
  make: string
  model: string
  year: number
  vehicleType: string
  fuelType: string
  tankCapacityLiters: number
  expectedEfficiencyKmL: number
  status: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

Conductores

Driver {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  licenseNumber: string
  licenseType: string
  licenseExpiresAt: Date
  status: string
  createdAt: Date
  updatedAt: Date
}

Asignaciones

VehicleDriverAssignment {
  id: string
  vehicleId: string
  driverId: string
  assignedAt: Date
  unassignedAt: Date?
  active: boolean
  createdAt: Date
  updatedAt: Date
}

La tabla de asignaciones debe relacionarse con vehículos y conductores.

Endpoints requeridos

Vehículos

GET    /vehicles
GET    /vehicles/:id
POST   /vehicles
PUT    /vehicles/:id
DELETE /vehicles/:id

Debe permitir:

 Listar vehículos. 

 Obtener vehículo por ID. 

 Crear vehículo. 

 Editar vehículo. 

 Eliminar o desactivar vehículo. 

Conductores

GET    /drivers
GET    /drivers/:id
POST   /drivers
PUT    /drivers/:id
DELETE /drivers/:id

Debe permitir:

 Listar conductores. 

 Obtener conductor por ID. 

 Crear conductor. 

 Editar conductor. 

 Eliminar o desactivar conductor. 

Asignaciones

GET    /assignments
GET    /assignments/:id
POST   /assignments
PATCH  /assignments/:id/finish

Debe permitir:

 Listar asignaciones. 

 Obtener asignación por ID. 

 Crear asignación entre vehículo y conductor. 

 Finalizar asignación activa. 

Reglas de negocio

Vehículos

 La placa es obligatoria. 

 El código operativo es obligatorio. 

 No se deben permitir placas duplicadas. 

 Un vehículo inactivo no puede asignarse a un conductor. 

Conductores

 El nombre completo es obligatorio. 

 El número de licencia es obligatorio. 

 No se deben permitir licencias duplicadas. 

 Un conductor inactivo no puede asignarse a un vehículo. 

 Un conductor con licencia vencida no puede asignarse a un vehículo. 

Asignaciones

 Un vehículo solo puede tener un conductor activo al mismo tiempo. 

 Un conductor solo puede estar asignado activamente a un vehículo al mismo tiempo. 

 Al finalizar una asignación, se debe llenar unassignedAt y cambiar active a false. 

Integración con frontend Angular

Actualizar el proyecto Angular anterior para dejar de usar mocks y consumir la API local.

Debe implementarse:

 Servicio HTTP para vehículos. 

 Servicio HTTP para conductores. 

 Servicio HTTP para asignaciones. 

 Reemplazo de repositorios mock por repositorios HTTP. 

 Manejo de errores básicos. 

 Indicadores de carga. 

 Mensajes de éxito/error con PrimeNG. 

La arquitectura del frontend debe mantenerse.
 El cambio de mocks a API debe hacerse en la capa de infraestructura, sin mover la lógica de negocio a los componentes.

Requerimientos técnicos

Backend

 Usar TypeScript. 

 Usar Prisma para el acceso a PostgreSQL. 

 Crear archivo .env.example. 

 Crear migraciones con Prisma. 

 Crear seed inicial con al menos: 

 5 vehículos. 

 5 conductores. 

 2 asignaciones. 

 Validar datos de entrada. 

 Manejar errores con respuestas HTTP claras. 

 Configurar CORS para permitir consumo desde Angular local. 

Frontend

 Consumir API desde environment. 

 No consumir URLs quemadas directamente en componentes. 

 Mantener repositorios abstractos o interfaces. 

 Usar implementación HTTP en lugar de implementación mock. 

 Validar que los CRUD sigan funcionando con API. 

Estructura sugerida del backend

src/
 ├── config/
 │   └── env.ts
 │
 ├── modules/
 │   ├── vehicles/
 │   │   ├── vehicle.routes.ts
 │   │   ├── vehicle.controller.ts
 │   │   ├── vehicle.service.ts
 │   │   └── vehicle.validation.ts
 │   │
 │   ├── drivers/
 │   │   ├── driver.routes.ts
 │   │   ├── driver.controller.ts
 │   │   ├── driver.service.ts
 │   │   └── driver.validation.ts
 │   │
 │   └── assignments/
 │       ├── assignment.routes.ts
 │       ├── assignment.controller.ts
 │       ├── assignment.service.ts
 │       └── assignment.validation.ts
 │
 ├── prisma/
 │   └── prisma.service.ts
 │
 ├── app.ts
 └── server.ts

Respuestas esperadas de API

Las respuestas deben usar un formato consistente.

Ejemplo exitoso:

{
  "data": {
    "id": "1",
    "plate": "ABC-123"
  },
  "message": "Vehicle created successfully"
}

Ejemplo de error:

{
  "message": "Vehicle plate already exists",
  "error": "DUPLICATED_PLATE"
}

Pruebas mínimas

Agregar pruebas para validar:

Backend

 Creación de vehículo. 

 Rechazo de placa duplicada. 

 Creación de conductor. 

 Rechazo de licencia duplicada. 

 Creación de asignación válida. 

 Rechazo de asignación con conductor inactivo. 

 Rechazo de asignación con licencia vencida. 

 Rechazo de asignación con vehículo inactivo. 

 Rechazo de asignación duplicada activa. 

 Finalización correcta de asignación. 

Frontend

 Validar que los repositorios HTTP llamen a los endpoints correctos. 

 Validar que los casos de uso sigan funcionando con implementación HTTP. 

 Validar manejo básico de errores. 

Entregable final

El practicante debe entregar:

 Backend local funcional. 

 Schema de Prisma. 

 Migraciones. 

 Seed de datos. 

 Endpoints REST funcionando. 

 Frontend actualizado para consumir API. 

 Repositorios HTTP implementados en Angular. 

 Pruebas unitarias mínimas. 

 README actualizado con: 

 Instalación del backend. 

 Configuración de PostgreSQL. 

 Variables de entorno. 

 Comandos de migración. 

 Comandos de seed. 

 Ejecución del backend. 

 Ejecución del frontend. 

 Ejecución de pruebas. 

Criterios de aceptación

La tarea se considera terminada cuando:

 El backend corre localmente sin errores. 

 PostgreSQL se conecta correctamente mediante Prisma. 

 Las migraciones crean las tablas necesarias. 

 El seed carga datos iniciales. 

 Los endpoints de vehículos funcionan. 

 Los endpoints de conductores funcionan. 

 Los endpoints de asignaciones funcionan. 

 Se aplican las reglas de negocio principales. 

 El frontend ya no depende de mocks para los CRUD. 

 El frontend consume la API local mediante repositorios HTTP. 

 Las pruebas unitarias pasan correctamente. 

 El README explica cómo levantar todo el proyecto localmente.

