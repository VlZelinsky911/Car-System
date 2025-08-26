import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { userService } from "../services/user.service";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
const updateSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error.format());
  try {
    const user = await userService.create(parsed.data);
    res.status(201).json(user);
  } catch (e) { next(e); }
};

export const listUsers = async (_: Request, res: Response, next: NextFunction) => {
  try { res.json(await userService.list()); } catch (e) { next(e); }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json(await userService.getById(Number(req.params.id))); } catch (e) { next(e); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json(parsed.error.format());
  try {
    const user = await userService.update(Number(req.params.id), parsed.data);
    res.json(user);
  } catch (e) { next(e); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try { await userService.remove(Number(req.params.id)); res.sendStatus(204); } catch (e) { next(e); }
};
