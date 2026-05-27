import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../app";
import { disconnectPrisma, prisma } from "../prisma/prisma.service";

const testRun = Date.now().toString();
let server: Server;
let baseUrl: string;

type ApiResult<T> = {
  status: number;
  body: T;
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResult<T>> => {
  const options: RequestInit = {
    method,
  };

  if (body) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, options);

  return {
    status: response.status,
    body: (await response.json()) as T,
  };
};

const buildVehicle = (suffix: string, overrides = {}) => ({
  code: `TST${suffix}`.slice(0, 10),
  plate: `T${suffix}`.slice(0, 8),
  vin: "",
  make: "Nissan",
  model: "Versa",
  year: 2026,
  vehicleType: "Sedan",
  fuelType: "Gasolina",
  tankCapacityLiters: 45,
  expectedEfficiencyKmL: 15,
  status: "Disponible",
  active: true,
  ...overrides,
});

const buildDriver = (suffix: string, overrides = {}) => ({
  employeeCode: `D${suffix}`.slice(0, 10),
  fullName: `Conductor ${suffix}`,
  email: `driver.${testRun}.${suffix}@test.com`,
  phone: `55${suffix}`.slice(0, 10),
  licenseNumber: `LIC${suffix}`.slice(0, 15),
  licenseType: "Tipo B",
  licenseExpiresAt: "2029-12-31T00:00:00.000Z",
  status: "Disponible",
  ...overrides,
});

const cleanup = async () => {
  await prisma.vehicleDriverAssignment.deleteMany({
    where: {
      OR: [
        { vehicle: { code: { startsWith: "TST" } } },
        { driver: { email: { contains: `driver.${testRun}` } } },
      ],
    },
  });
  await prisma.driver.deleteMany({
    where: {
      email: { contains: `driver.${testRun}` },
    },
  });
  await prisma.vehicle.deleteMany({
    where: {
      code: { startsWith: "TST" },
    },
  });
};

describe("API business rules", () => {
  beforeAll(async () => {
    await cleanup();
    server = app.listen(0);
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("No se pudo iniciar el servidor de prueba");
    }

    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await cleanup();
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await disconnectPrisma();
  });

  it("crea un vehiculo valido", async () => {
    const response = await request<{ data: { id: string; plate: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V01"),
    );

    expect(response.status).toBe(201);
    expect(response.body.data.plate).toBe("TV01");
  });

  it("rechaza placa duplicada", async () => {
    await request("POST", "/vehicles", buildVehicle("V02"));
    const response = await request<{ error: string }>(
      "POST",
      "/vehicles",
      buildVehicle("V03", { plate: "TV02" }),
    );

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("DUPLICATED_PLATE");
  });

  it("crea un conductor valido", async () => {
    const response = await request<{ data: { id: string; licenseNumber: string } }>(
      "POST",
      "/drivers",
      buildDriver("D01"),
    );

    expect(response.status).toBe(201);
    expect(response.body.data.licenseNumber).toBe("LICD01");
  });

  it("rechaza licencia duplicada", async () => {
    await request("POST", "/drivers", buildDriver("D02"));
    const response = await request<{ error: string }>(
      "POST",
      "/drivers",
      buildDriver("D03", { licenseNumber: "LICD02" }),
    );

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("DUPLICATED_LICENSE");
  });

  it("crea una asignacion valida", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V04"),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D04"),
    );
    const assignment = await request<{ data: { active: boolean } }>(
      "POST",
      "/assignments",
      {
        vehicleId: vehicle.body.data.id,
        driverId: driver.body.data.id,
      },
    );

    expect(assignment.status).toBe(201);
    expect(assignment.body.data.active).toBe(true);
  });

  it("rechaza asignacion con conductor inactivo", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V05"),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D05", { status: "INACTIVO" }),
    );
    const response = await request<{ error: string }>("POST", "/assignments", {
      vehicleId: vehicle.body.data.id,
      driverId: driver.body.data.id,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INACTIVE_DRIVER");
  });

  it("rechaza asignacion con licencia vencida", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V06"),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D06", { licenseExpiresAt: "2020-01-01T00:00:00.000Z" }),
    );
    const response = await request<{ error: string }>("POST", "/assignments", {
      vehicleId: vehicle.body.data.id,
      driverId: driver.body.data.id,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("EXPIRED_LICENSE");
  });

  it("rechaza asignacion con vehiculo inactivo", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V07", { status: "Inactivo", active: false }),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D07"),
    );
    const response = await request<{ error: string }>("POST", "/assignments", {
      vehicleId: vehicle.body.data.id,
      driverId: driver.body.data.id,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INACTIVE_VEHICLE");
  });

  it("rechaza asignacion activa duplicada", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V08"),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D08"),
    );
    const secondDriver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D09"),
    );

    await request("POST", "/assignments", {
      vehicleId: vehicle.body.data.id,
      driverId: driver.body.data.id,
    });
    const response = await request<{ error: string }>("POST", "/assignments", {
      vehicleId: vehicle.body.data.id,
      driverId: secondDriver.body.data.id,
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("ACTIVE_VEHICLE_ASSIGNMENT_EXISTS");
  });

  it("finaliza correctamente una asignacion", async () => {
    const vehicle = await request<{ data: { id: string } }>(
      "POST",
      "/vehicles",
      buildVehicle("V09"),
    );
    const driver = await request<{ data: { id: string } }>(
      "POST",
      "/drivers",
      buildDriver("D10"),
    );
    const assignment = await request<{ data: { id: string } }>(
      "POST",
      "/assignments",
      {
        vehicleId: vehicle.body.data.id,
        driverId: driver.body.data.id,
      },
    );
    const response = await request<{
      data: { active: boolean; unassignedAt: string | null };
    }>("PATCH", `/assignments/${assignment.body.data.id}/finish`, {});

    expect(response.status).toBe(200);
    expect(response.body.data.active).toBe(false);
    expect(response.body.data.unassignedAt).toBeTruthy();
  });
});
