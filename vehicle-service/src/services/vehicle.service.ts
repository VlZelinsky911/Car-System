import { prisma } from "../db/prisma";
import { AppError } from "../errors";

export type CreateVehicleInput = {
  make: string;
  model: string;
  year?: number;
  userId: number;
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export type PublicVehicle = {
  id: number;
  make: string;
  model: string;
  year?: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

function toPublic(v: any): PublicVehicle {
  const { id, make, model, year, userId, createdAt, updatedAt } = v;
  return { id, make, model, year, userId, createdAt, updatedAt };
}

export const vehicleService = {
  async create(input: CreateVehicleInput): Promise<PublicVehicle> {
    const v = await prisma.vehicle.create({ data: input });
    return toPublic(v);
  },

  async list(filter?: { userId?: number }): Promise<PublicVehicle[]> {
    const v = await prisma.vehicle.findMany({
      where: { userId: filter?.userId },
      orderBy: { id: "asc" },
    });
    return v.map(toPublic);
  },

  async getById(id: number): Promise<PublicVehicle> {
    const v = await prisma.vehicle.findUnique({ where: { id } });
    if (!v) throw new AppError(404, "NOT_FOUND", "Vehicle not found");
    return toPublic(v);
  },

  async update(id: number, data: UpdateVehicleInput): Promise<PublicVehicle> {
    try {
      const v = await prisma.vehicle.update({ where: { id }, data });
      return toPublic(v);
    } catch (err: any) {
      if (err?.code === "P2025") throw new AppError(404, "NOT_FOUND", "Vehicle not found");
      throw err;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await prisma.vehicle.delete({ where: { id } });
    } catch (err: any) {
      if (err?.code === "P2025") throw new AppError(404, "NOT_FOUND", "Vehicle not found");
      throw err;
    }
  },
};
