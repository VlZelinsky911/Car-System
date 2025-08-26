import { Router } from "express";
import { createVehicle, listVehicles, getVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicle.controller";

export const vehicleRouter = Router();

vehicleRouter.post("/vehicles", createVehicle);
vehicleRouter.get("/vehicles", listVehicles);
vehicleRouter.get("/vehicles/:id", getVehicle);
vehicleRouter.patch("/vehicles/:id", updateVehicle);
vehicleRouter.delete("/vehicles/:id", deleteVehicle);
