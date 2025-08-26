import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { vehicleService } from "../services/vehicle.service";

const createSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1886).max(3000).optional(),
  userId: z.number().int().positive(),
});

const updateSchema = z.object({
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1886).max(3000).optional(),
  userId: z.number().int().positive().optional(),
});

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  const p = createSchema.safeParse(req.body);
  if (!p.success) return res.status(422).json(p.error.format());
  try {
    const v = await vehicleService.create(p.data);
    res.status(201).json(v);
  } catch (e) { next(e); }
};

export const listVehicles = async (req: Request, res: Response, next: NextFunction) => {
  // опційний фільтр по userId: /vehicles?userId=1
  const q = z.object({ userId: z.string().regex(/^\d+$/).transform(Number).optional() }).safeParse(req.query);
  if (!q.success) return res.status(422).json(q.error.format());
  try {
    const items = await vehicleService.list({ userId: q.data.userId });
    res.json(items);
  } catch (e) { next(e); }
};

export const getVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await vehicleService.getById(Number(req.params.id))); } catch (e) { next(e); }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  const p = updateSchema.safeParse(req.body);
  if (!p.success) return res.status(422).json(p.error.format());
  try {
    const v = await vehicleService.update(Number(req.params.id), p.data);
    res.json(v);
  } catch (e) { next(e); }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try { await vehicleService.remove(Number(req.params.id)); res.sendStatus(204); } catch (e) { next(e); }
};
