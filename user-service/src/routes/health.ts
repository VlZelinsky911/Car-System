import { Router } from "express";
import { prisma } from "../db/prisma";

export const healthRouter = Router();


healthRouter.get("/health", async (_req, res) => {
  let db = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "up";
  } catch {
    db = "down";
  }

  const status = db === "up" ? "ok" : "degraded";
  res.status(status === "ok" ? 200 : 503).json({
    service: "user-service",
    status,
    db,
    uptimeSec: Math.round(process.uptime()),
  });
});
