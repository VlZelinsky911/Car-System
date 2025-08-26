import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { publishUserCreated } from "../rabbit/publisher";
import { AppError } from "../errors";

export type CreateUserInput = { email: string; name?: string; password: string };
export type UpdateUserInput = { email?: string; name?: string; password?: string };
export type PublicUser = { id: number; email: string; name?: string | null; createdAt: Date; updatedAt: Date };

function toPublic(u: any): PublicUser {
  const { id, email, name, createdAt, updatedAt } = u;
  return { id, email, name, createdAt, updatedAt };
}

export const userService = {
  async create(input: CreateUserInput): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(input.password, 12);
    try {
      const user = await prisma.user.create({
        data: { email: input.email.toLowerCase(), name: input.name, passwordHash },
      });
      
      await publishUserCreated(process.env.RABBITMQ_URL!, { type: "USER_CREATED", data: { id: user.id, email: user.email } });
      return toPublic(user);
    } catch (err: any) {
      if (err?.code === "P2002") throw new AppError(409, "EMAIL_TAKEN", "Email is already in use");
      throw err;
    }
  },

  async list(): Promise<PublicUser[]> {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    return users.map(toPublic);
  },

  async getById(id: number): Promise<PublicUser> {
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u) throw new AppError(404, "NOT_FOUND", "User not found");
    return toPublic(u);
  },

  async update(id: number, data: UpdateUserInput): Promise<PublicUser> {
    const updateData: any = {};
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.name !== undefined) updateData.name = data.name;
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 12);

    try {
      const u = await prisma.user.update({ where: { id }, data: updateData });
      return toPublic(u);
    } catch (err: any) {
      if (err?.code === "P2002") throw new AppError(409, "EMAIL_TAKEN", "Email is already in use");
      if (err?.code === "P2025") throw new AppError(404, "NOT_FOUND", "User not found");
      throw err;
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (err: any) {
      if (err?.code === "P2025") throw new AppError(404, "NOT_FOUND", "User not found");
      throw err;
    }
  },
};

