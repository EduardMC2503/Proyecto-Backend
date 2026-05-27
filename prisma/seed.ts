import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL es obligatoria para ejecutar el seed");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const vehicles = [
  {
    code: "VH-001",
    plate: "ABC-123",
    vin: "1HGCM82633A004352",
    make: "Toyota",
    model: "Hilux",
    year: 2023,
    vehicleType: "CAMIONETA",
    fuelType: "GASOLINA",
    tankCapacityLiters: 80,
    expectedEfficiencyKmL: 10.5,
    status: "Asignado",
    active: true,
  },
  {
    code: "VH-002",
    plate: "DEF-456",
    vin: "2HGFG11868H500001",
    make: "Nissan",
    model: "NP300",
    year: 2022,
    vehicleType: "CAMIONETA",
    fuelType: "DIESEL",
    tankCapacityLiters: 75,
    expectedEfficiencyKmL: 11.2,
    status: "Asignado",
    active: true,
  },
  {
    code: "VH-003",
    plate: "GHI-789",
    vin: "3FAHP0HA6AR100001",
    make: "Ford",
    model: "Transit",
    year: 2021,
    vehicleType: "VAN",
    fuelType: "DIESEL",
    tankCapacityLiters: 95,
    expectedEfficiencyKmL: 8.8,
    status: "Disponible",
    active: true,
  },
  {
    code: "VH-004",
    plate: "JKL-012",
    vin: "5NPE24AF4FH001234",
    make: "Chevrolet",
    model: "S10",
    year: 2020,
    vehicleType: "CAMIONETA",
    fuelType: "GASOLINA",
    tankCapacityLiters: 76,
    expectedEfficiencyKmL: 9.7,
    status: "Mantenimiento",
    active: true,
  },
  {
    code: "VH-005",
    plate: "MNO-345",
    vin: "1FTFW1EF1EFA00001",
    make: "Volkswagen",
    model: "Crafter",
    year: 2024,
    vehicleType: "VAN",
    fuelType: "DIESEL",
    tankCapacityLiters: 100,
    expectedEfficiencyKmL: 9.1,
    status: "Disponible",
    active: true,
  },
];

const drivers = [
  {
    employeeCode: "DR-001",
    fullName: "Carlos Hernandez Lopez",
    email: "carlos.hernandez@example.com",
    phone: "5551001001",
    licenseNumber: "LIC-001",
    licenseType: "Tipo B",
    licenseExpiresAt: new Date("2028-12-31T00:00:00.000Z"),
    status: "Asignado",
  },
  {
    employeeCode: "DR-002",
    fullName: "Mariana Torres Ruiz",
    email: "mariana.torres@example.com",
    phone: "5551001002",
    licenseNumber: "LIC-002",
    licenseType: "Tipo C",
    licenseExpiresAt: new Date("2029-06-30T00:00:00.000Z"),
    status: "Asignado",
  },
  {
    employeeCode: "DR-003",
    fullName: "Jorge Ramirez Soto",
    email: "jorge.ramirez@example.com",
    phone: "5551001003",
    licenseNumber: "LIC-003",
    licenseType: "Tipo B",
    licenseExpiresAt: new Date("2027-09-15T00:00:00.000Z"),
    status: "Disponible",
  },
  {
    employeeCode: "DR-004",
    fullName: "Ana Martinez Vega",
    email: "ana.martinez@example.com",
    phone: "5551001004",
    licenseNumber: "LIC-004",
    licenseType: "Tipo A",
    licenseExpiresAt: new Date("2028-03-20T00:00:00.000Z"),
    status: "Disponible",
  },
  {
    employeeCode: "DR-005",
    fullName: "Luis Fernandez Mora",
    email: "luis.fernandez@example.com",
    phone: "5551001005",
    licenseNumber: "LIC-005",
    licenseType: "Tipo C",
    licenseExpiresAt: new Date("2030-01-10T00:00:00.000Z"),
    status: "Disponible",
  },
];

const main = async () => {
  await prisma.vehicleDriverAssignment.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();

  const createdVehicles = await Promise.all(
    vehicles.map((vehicle) =>
      prisma.vehicle.create({
        data: vehicle,
      }),
    ),
  );

  const createdDrivers = await Promise.all(
    drivers.map((driver) =>
      prisma.driver.create({
        data: driver,
      }),
    ),
  );

  await prisma.vehicleDriverAssignment.createMany({
    data: [
      {
        vehicleId: createdVehicles[0].id,
        driverId: createdDrivers[0].id,
        assignedAt: new Date("2026-05-01T09:00:00.000Z"),
        active: true,
      },
      {
        vehicleId: createdVehicles[1].id,
        driverId: createdDrivers[1].id,
        assignedAt: new Date("2026-05-02T09:00:00.000Z"),
        active: true,
      },
    ],
  });

  console.log("Seed ejecutado correctamente");
};

main()
  .catch((error) => {
    console.error("Error al ejecutar el seed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
